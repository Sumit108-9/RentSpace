import Order from '../models/order.model.js';
import Product from '../models/product.model.js';

export const getOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};
    if (req.user.role !== 'admin') {
      query.user = req.user.id;
    }

    if (req.query.status) {
      query.orderStatus = req.query.status;
    }

    const orders = await Order.find(query)
      .populate('orderItems.product', 'name images')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('orderItems.product', 'name images monthlyRent')
      .populate('user', 'name email phone');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      contactInfo,
      paymentMethod,
      couponCode,
      rentalStartDate
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items' });
    }

    let itemsTotal = 0;
    let securityDeposit = 0;

    const populatedOrderItems = await Promise.all(
      orderItems.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }
        if (product.countInStock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }

        const itemTotal = product.monthlyRent * item.rentalDuration * item.quantity;
        itemsTotal += itemTotal;
        securityDeposit += product.securityDeposit * item.quantity;

        return {
          product: product._id,
          name: product.name,
          image: product.images[0],
          monthlyRent: product.monthlyRent,
          rentalDuration: item.rentalDuration,
          quantity: item.quantity
        };
      })
    );

    const deliveryFee = itemsTotal > 5000 ? 0 : 299;
    let discount = 0;

    if (couponCode && couponCode.toUpperCase() === 'RENT10') {
      discount = itemsTotal * 0.1;
    }

    const totalAmount = itemsTotal + securityDeposit + deliveryFee - discount;

    const rentalEndDate = new Date(rentalStartDate);
    rentalEndDate.setMonth(rentalEndDate.getMonth() + populatedOrderItems[0].rentalDuration);

    const order = await Order.create({
      user: req.user.id,
      orderItems: populatedOrderItems,
      shippingAddress,
      contactInfo,
      paymentInfo: {
        method: paymentMethod,
        status: paymentMethod === 'cod' ? 'pending' : 'pending'
      },
      itemsTotal,
      securityDeposit,
      deliveryFee,
      discount,
      couponCode,
      totalAmount,
      rentalStartDate: new Date(rentalStartDate),
      rentalEndDate
    });

    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { countInStock: -item.quantity }
      });
    }

    res.status(201).json({
      success: true,
      order: await Order.findById(order._id).populate('orderItems.product', 'name images')
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    
    if (orderStatus === 'delivered') {
      order.deliveredAt = new Date();
    }

    await order.save();

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

export const getOrderStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (order.orderStatus === 'delivered' || order.orderStatus === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Order cannot be cancelled' });
    }

    order.orderStatus = 'cancelled';
    await order.save();

    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { countInStock: item.quantity }
      });
    }

    res.json({ success: true, message: 'Order cancelled successfully' });
  } catch (error) {
    next(error);
  }
};

import Order from '../models/order.model.js';
import Product from '../models/product.model.js';
import User from '../models/user.model.js';
import Counter from '../models/counter.model.js';
import { 
  sendOrderConfirmationEmail, 
  sendOrderStatusEmail, 
  sendAdminNewOrderNotification 
} from '../services/email.service.js';

export const generateOrderId = async () => {
  try {
    const year = new Date().getFullYear();
    
    // Count orders for current year
    const orderCount = await Order.countDocuments({
      createdAt: {
        $gte: new Date(`${year}-01-01`),
        $lt: new Date(`${year + 1}-01-01`)
      }
    });
    
    const paddedNumber = String(orderCount + 1).padStart(4, '0');
    return `RS-${year}-${paddedNumber}`;
  } catch (error) {
    throw new Error('Failed to generate order ID: ' + error.message);
  }
};

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
      .populate('orderItems.product', 'name images monthlyRent')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

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
      .populate('user', 'name email phone')
      .lean();

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
      rentalStartDate,
      razorpayPaymentId,
      razorpayOrderId
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items' });
    }

    let itemsTotal = 0;

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

    const totalAmount = itemsTotal + deliveryFee - discount;

    const rentalEndDate = new Date(rentalStartDate);
    rentalEndDate.setMonth(rentalEndDate.getMonth() + populatedOrderItems[0].rentalDuration);

    // ♻️ SMART ORDER HANDLING: Check if order exists with same user + payment
    let existingOrder = null;
    if (razorpayPaymentId || razorpayOrderId) {
      existingOrder = await Order.findOne({
        user: req.user.id,
        $or: [
          { razorpayPaymentId: razorpayPaymentId },
          { razorpayOrderId: razorpayOrderId }
        ]
      });
    }

    // Generate new order ID if creating new order
    const orderId = existingOrder ? existingOrder.orderId : await generateOrderId();

    const orderData = {
      orderId,
      orderNumber: orderId, // Keep for backwards compatibility
      user: req.user.id,
      razorpayPaymentId: razorpayPaymentId || null,
      razorpayOrderId: razorpayOrderId || null,
      orderItems: populatedOrderItems,
      shippingAddress,
      contactInfo,
      paymentInfo: {
        method: paymentMethod,
        status: paymentMethod === 'cod' ? 'pending' : 'pending'
      },
      itemsTotal,
      deliveryFee,
      discount,
      couponCode,
      totalAmount,
      rentalStartDate: new Date(rentalStartDate),
      rentalEndDate
    };

    let order;
    if (existingOrder) {
      // ♻️ UPDATE existing order
      existingOrder.orderItems = populatedOrderItems;
      existingOrder.itemsTotal = itemsTotal;
      existingOrder.deliveryFee = deliveryFee;
      existingOrder.discount = discount;
      existingOrder.totalAmount = totalAmount;
      existingOrder.shippingAddress = shippingAddress;
      existingOrder.contactInfo = contactInfo;
      existingOrder.couponCode = couponCode;
      existingOrder.rentalStartDate = new Date(rentalStartDate);
      existingOrder.rentalEndDate = rentalEndDate;
      existingOrder.updatedAt = new Date();
      if (razorpayPaymentId) {
        existingOrder.razorpayPaymentId = razorpayPaymentId;
        existingOrder.isPaid = true;
        existingOrder.paidAt = new Date();
        existingOrder.paymentStatus = 'completed';
        existingOrder.orderStatus = 'confirmed';
      }
      await existingOrder.save();
      order = existingOrder;
    } else {
      // 🆕 CREATE new order
      order = await Order.create(orderData);
      
      // Update stock for new orders only
      for (const item of orderItems) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { countInStock: -item.quantity }
        });
      }
    }

    // Get user details for email
    const user = await User.findById(req.user.id);
    console.log('Preparing to send order confirmation email to:', user?.email);

    // Prepare order data for email
    const orderDetails = await Order.findById(order._id)
      .populate('orderItems.product', 'name images')
      .populate('user', 'name email phone');

    console.log('Order data for email:', {
      orderId: orderDetails._id,
      userEmail: user?.email,
      totalAmount: orderDetails.totalAmount
    });

    // Send order confirmation email to user (fire and forget - don't block response)
    sendOrderConfirmationEmail(user, {
      _id: orderDetails._id,
      orderId: orderDetails.orderId,
      orderItems: orderDetails.orderItems,
      totalPrice: orderDetails.totalAmount,
      status: orderDetails.orderStatus,
      createdAt: orderDetails.createdAt,
      paymentType: orderDetails.paymentInfo?.method || 'Full',
      paymentMethod: orderDetails.paymentInfo?.method || 'cod',
      shippingAddress: orderDetails.shippingAddress,
      rentalDuration: orderDetails.orderItems?.[0]?.rentalDuration,
      discount: orderDetails.discount || 0,
      deliveryFee: orderDetails.deliveryFee || 0
    }).then(() => {
      console.log('✅ Order confirmation email sent successfully to:', user?.email);
    }).catch(emailError => {
      console.error('❌ Failed to send order confirmation email:', emailError.message);
      console.error('Error details:', emailError);
    });

    // Send admin notification (fire and forget - don't block response)
    sendAdminNewOrderNotification({
      _id: orderDetails._id,
      orderId: orderDetails.orderId,
      user: orderDetails.user,
      totalPrice: orderDetails.totalAmount,
      orderItems: orderDetails.orderItems
    }).catch(emailError => {
      console.error('Failed to send admin notification:', emailError.message);
    });

    res.status(201).json({
      success: true,
      order: orderDetails
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .select('orderStatus paymentStatus orderItems user deliveredAt');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const oldStatus = order.orderStatus;

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    
    if (orderStatus === 'delivered') {
      order.deliveredAt = new Date();
    }

    await order.save();

    // Send status update email if status changed (don't block response)
    if (orderStatus && orderStatus !== oldStatus && order.user) {
      try {
        await sendOrderStatusEmail(order.user, order, orderStatus);
      } catch (emailError) {
        console.error('Failed to send status update email:', emailError.message);
      }
    }

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
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .select('orderStatus paymentStatus orderItems user deliveredAt');
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (order.orderStatus === 'delivered' || order.orderStatus === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Order cannot be cancelled' });
    }

    order.orderStatus = 'cancelled';
    await order.save();

    // Restore stock
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { countInStock: item.quantity }
      });
    }

    // Send cancellation email (don't block response)
    if (order.user) {
      try {
        await sendOrderStatusEmail(order.user, order, 'cancelled');
      } catch (emailError) {
        console.error('Failed to send cancellation email:', emailError.message);
      }
    }

    res.json({ success: true, message: 'Order cancelled successfully' });
  } catch (error) {
    next(error);
  }
};

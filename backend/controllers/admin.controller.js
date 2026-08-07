import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import Product from '../models/product.model.js';
import Order from '../models/order.model.js';

/**
 * @desc    Admin login
 * @route   POST /api/admin/login
 * @access  Public
 */
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const admin = await User.findOne({ email, role: 'admin' }).select('+password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: 'admin' },
      process.env.JWT_SECRET || 'fallbacksecret',
      { expiresIn: '1d' }
    );

    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      token,
      user: {
        id: admin._id,
        email: admin.email,
        role: 'admin',
        name: admin.name
      }
    });
  } catch (error) {
    console.error('Admin Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
};

/**
 * @desc    Get all products (admin)
 * @route   GET /api/admin/products
 * @access  Private/Admin
 */
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Get Products Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
};

/**
 * @desc    Create new product
 * @route   POST /api/admin/products
 * @access  Private/Admin
 */
export const createProduct = async (req, res) => {
  try {
    const { name, description, monthlyRent, securityDeposit, images, category, countInStock, isFeatured, isActive } = req.body;

    if (!name || !monthlyRent || !category) {
      return res.status(400).json({
        success: false,
        message: 'Name, monthly rent, and category are required'
      });
    }

    const processedImages = Array.isArray(images) ? images : [];

    const product = await Product.create({
      name,
      description: description || 'No description provided',
      monthlyRent,
      securityDeposit: securityDeposit || 0,
      images: processedImages,
      category,
      countInStock: countInStock ?? 10,
      isFeatured: isFeatured || false,
      isActive: isActive !== false
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Create Product Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  }
};

/**
 * @desc    Update product
 * @route   PUT /api/admin/products/:id
 * @access  Private/Admin
 */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = {};
    const allowed = ['name', 'description', 'monthlyRent', 'images', 'category', 'countInStock', 'isFeatured', 'isActive'];
    allowed.forEach(key => { if (req.body[key] !== undefined) updates[key] = req.body[key]; });

    const product = await Product.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Update Product Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
};

/**
 * @desc    Delete product
 * @route   DELETE /api/admin/products/:id
 * @access  Private/Admin
 */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete Product Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
};

/**
 * @desc   Aggregated admin stats for dashboard with COD-aware logic
 * @route  GET /api/admin/stats
 * @access Private/Admin
 */
export const getStats = async (req, res) => {
  try {
    const allOrders = await Order.find({}).lean();
    const totalCustomers = await User.countDocuments({ role: 'user' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalProducts = await Product.countDocuments({ isActive: true });
    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(8)
      .populate('user', 'name email')
      .select('orderNumber totalAmount orderStatus paymentStatus paymentMethod createdAt user orderItems');

    // Helpers - normalize values, read from both top-level and paymentInfo
    const getMethod = (o) => String(o.paymentMethod || o.paymentInfo?.method || '').toLowerCase();
    const getPayStatus = (o) => String(o.paymentStatus || o.paymentInfo?.status || '').toLowerCase();
    const isPaidStatus = (s) => ['paid', 'collected', 'completed'].includes(s);
    const isPendingStatus = (s) => ['pending', 'unpaid', ''].includes(s);
    const isCOD = (m) => m === 'cod';
    const isOnline = (m) => ['card', 'upi', 'netbanking', 'razorpay', 'online'].includes(m);

    // Order counting logic
    const validOrders = allOrders.filter(o => o.orderStatus !== 'cancelled');
    const totalOrders = validOrders.length;

    const onlinePaidOrders = allOrders.filter(o => isOnline(getMethod(o)) && isPaidStatus(getPayStatus(o))).length;
    const codPendingOrders = allOrders.filter(o => isCOD(getMethod(o)) && isPendingStatus(getPayStatus(o)) && o.orderStatus !== 'cancelled').length;
    const cancelledOrders = allOrders.filter(o => o.orderStatus === 'cancelled').length;

    const activeRentals = allOrders.filter(o => ['confirmed', 'shipped', 'delivered'].includes(o.orderStatus)).length;

    // Revenue calculations - only Paid/Collected orders
    const totalRevenue = allOrders
      .filter(o => isPaidStatus(getPayStatus(o)) && o.orderStatus !== 'cancelled')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    const pendingCODAmount = allOrders
      .filter(o => isCOD(getMethod(o)) && isPendingStatus(getPayStatus(o)) && o.orderStatus !== 'cancelled')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    const codCollectedRevenue = allOrders
      .filter(o => isCOD(getMethod(o)) && isPaidStatus(getPayStatus(o)) && o.orderStatus !== 'cancelled')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    // Revenue by month from paid/collected orders
    const monthMap = {};
    allOrders.forEach(o => {
      if (!isPaidStatus(getPayStatus(o)) || o.orderStatus === 'cancelled') return;
      const d = new Date(o.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!monthMap[key]) monthMap[key] = { revenue: 0, orders: 0 };
      monthMap[key].revenue += (o.totalAmount || 0);
      monthMap[key].orders += 1;
    });
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const revenueByMonth = Object.keys(monthMap).sort().slice(-12).map(key => {
      const [, mo] = key.split('-');
      return { month: monthNames[parseInt(mo, 10) - 1], revenue: monthMap[key].revenue, orders: monthMap[key].orders };
    });

    // Top products aggregation
    const topProductsAgg = await Order.aggregate([
      { $unwind: '$orderItems' },
      {
        $group: {
          _id: '$orderItems.product',
          name: { $first: '$orderItems.name' },
          image: { $first: '$orderItems.image' },
          orderCount: { $sum: '$orderItems.quantity' },
          revenue: {
            $sum: {
              $multiply: [
                '$orderItems.monthlyRent',
                '$orderItems.rentalDuration',
                '$orderItems.quantity'
              ]
            }
          }
        }
      },
      { $sort: { orderCount: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      success: true,
      stats: {
        totalOrders,
        onlinePaidOrders,
        codPendingOrders,
        cancelledOrders,
        totalRevenue,
        pendingCODAmount,
        codCollectedRevenue,
        activeRentals,
        totalCustomers,
        totalAdmins,
        totalProducts
      },
      revenueByMonth,
      topProducts: topProductsAgg,
      recentOrders
    });
  } catch (error) {
    console.error('Get Stats Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch stats', error: error.message });
  }
};

/**
 * @desc   All orders (admin)
 * @route  GET /api/admin/orders
 * @access Private/Admin
 */
export const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .populate('user', 'name email phone');
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    console.error('Get All Orders Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders', error: error.message });
  }
};

/**
 * @desc   Update order status / payment status (admin)
 * @route  PUT /api/admin/orders/:id/status
 * @access Private/Admin
 */
export const updateOrderStatusAdmin = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const allowedStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'];
    const allowedPaymentStatuses = ['pending', 'unpaid', 'paid', 'collected', 'completed', 'failed', 'refunded'];

    const update = {};

    if (status) {
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid order status' });
      }
      update.orderStatus = status;
      if (status === 'delivered') update.deliveredAt = new Date();
    }

    if (paymentStatus) {
      const normalized = String(paymentStatus).toLowerCase();
      if (!allowedPaymentStatuses.includes(normalized)) {
        return res.status(400).json({ success: false, message: 'Invalid payment status' });
      }
      update.paymentStatus = normalized;
      update['paymentInfo.status'] = normalized;
      if (['paid', 'collected', 'completed'].includes(normalized)) {
        update.isPaid = true;
        update.paidAt = new Date();
      }
    }

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ success: false, message: 'No update fields provided' });
    }

    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true })
      .populate('user', 'name email');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    res.json({ success: true, message: 'Order updated', order });
  } catch (error) {
    console.error('Update Order Status Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update order', error: error.message });
  }
};

/**
 * @desc   All users (admin)
 * @route  GET /api/admin/users
 * @access Private/Admin
 */
export const getAllUsersAdmin = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    console.error('Get All Users Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch users', error: error.message });
  }
};

import jwt from 'jsonwebtoken';
import Product from '../models/product.model.js';
import Order from '../models/order.model.js';
import User from '../models/user.model.js';

// Hardcoded admin credentials
const ADMIN_EMAIL = 'sumitdevv416@gmail.com';
const ADMIN_PASSWORD = 'Sumitdev108';

/**
 * @desc    Admin login
 * @route   POST /api/admin/login
 * @access  Public
 */
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check credentials against hardcoded values
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { email: ADMIN_EMAIL, role: 'admin' },
      process.env.JWT_SECRET || 'fallbacksecret',
      { expiresIn: '1d' }
    );

    // Return token and admin data (flat shape, matches /api/auth/login)
    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      token,
      user: {
        email: ADMIN_EMAIL,
        role: 'admin',
        name: 'Administrator'
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
    const { name, description, monthlyRent, images, category, countInStock, isFeatured, isActive } = req.body;

    if (!name || !monthlyRent || !category) {
      return res.status(400).json({
        success: false,
        message: 'Name, monthly rent, and category are required'
      });
    }

    const product = await Product.create({
      name,
      description: description || 'No description',
      monthlyRent,
      images: images || [],
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

    const product = await Product.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
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
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
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
 * @desc   Aggregated admin stats for the dashboard
 * @route  GET /api/admin/stats
 * @access Private/Admin
 */
export const getStats = async (req, res) => {
  try {
    const [
      totalOrders,
      activeRentals,
      totalCustomers,
      totalProducts,
      revenueAgg,
      revenueByMonthAgg,
      topProductsAgg,
      recentOrders,
    ] = await Promise.all([
      Order.countDocuments({}),
      Order.countDocuments({ orderStatus: { $in: ['confirmed', 'shipped', 'delivered'] } }),
      User.countDocuments({ role: 'user' }),
      Product.countDocuments({ isActive: true }),
      Order.aggregate([
        { $match: { isPaid: true } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Order.aggregate([
        { $match: { isPaid: true } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
            revenue: { $sum: '$totalAmount' },
            orders: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $limit: 12 },
      ]),
      Order.aggregate([
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
                  '$orderItems.quantity',
                ],
              },
            },
          },
        },
        { $sort: { orderCount: -1 } },
        { $limit: 5 },
      ]),
      Order.find({})
        .sort({ createdAt: -1 })
        .limit(8)
        .populate('user', 'name email')
        .select('orderNumber totalAmount orderStatus paymentStatus createdAt user orderItems'),
    ]);

    const totalRevenue = revenueAgg[0]?.total || 0;

    // Format month label (YYYY-MM → short month)
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const revenueByMonth = revenueByMonthAgg.map((m) => {
      const [y, mo] = m._id.split('-');
      return { month: monthNames[parseInt(mo, 10) - 1] || m._id, revenue: m.revenue, orders: m.orders };
    });

    res.json({
      success: true,
      stats: {
        totalOrders,
        totalRevenue,
        activeRentals,
        totalCustomers,
        totalProducts,
      },
      revenueByMonth,
      topProducts: topProductsAgg,
      recentOrders,
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
 * @desc   Update order status
 * @route  PUT /api/admin/orders/:id/status
 * @access Private/Admin
 */
export const updateOrderStatusAdmin = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    const update = { orderStatus: status };
    if (status === 'delivered') update.deliveredAt = new Date();

    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true }).populate(
      'user',
      'name email'
    );
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    res.json({ success: true, message: 'Order status updated', order });
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


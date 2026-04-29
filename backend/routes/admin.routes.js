import express from 'express';
import {
  adminLogin,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getStats,
  getAllOrdersAdmin,
  updateOrderStatusAdmin,
  getAllUsersAdmin
} from '../controllers/admin.controller.js';
import { adminAuth } from '../middleware/admin.middleware.js';
import { 
  validateAdminLogin,
  validateProductCreation,
  validateProductUpdate,
  validateProductId
} from '../middleware/validation.middleware.js';

const router = express.Router();

/**
 * Admin Authentication Routes
 */

// Public route - Admin login
router.post('/login', validateAdminLogin, adminLogin);

/**
 * Admin Product Management Routes
 * All routes below require admin authentication
 */

// Apply admin middleware to all routes below
router.use(adminAuth);

// Dashboard stats
router.get('/stats', getStats);

// Orders management
router.get('/orders', getAllOrdersAdmin);
router.put('/orders/:id/status', updateOrderStatusAdmin);

// Users management
router.get('/users', getAllUsersAdmin);

// Products management
router.get('/products', getAllProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

export default router;

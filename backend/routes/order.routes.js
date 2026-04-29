import express from 'express';
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  getOrderStats,
  cancelOrder
} from '../controllers/order.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';
import { 
  validateOrderCreation, 
  validateOrderId, 
  validateOrderStatusUpdate 
} from '../middleware/validation.middleware.js';

const router = express.Router();

router.get('/', protect, getOrders);
router.get('/stats', protect, adminOnly, getOrderStats);
router.post('/', protect, validateOrderCreation, createOrder);
router.get('/:id', protect, validateOrderId, getOrderById);
router.put('/:id/status', protect, adminOnly, validateOrderStatusUpdate, updateOrderStatus);
router.put('/:id/cancel', protect, validateOrderId, cancelOrder);

export default router;

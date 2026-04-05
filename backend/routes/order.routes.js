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

const router = express.Router();

router.get('/', protect, getOrders);
router.get('/stats', protect, adminOnly, getOrderStats);
router.post('/', protect, createOrder);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);
router.put('/:id/cancel', protect, cancelOrder);

export default router;

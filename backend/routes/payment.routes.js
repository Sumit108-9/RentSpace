import express from 'express';
import {
  createOrder,
  verifyPayment,
  getPaymentDetails,
  getOrderDetails,
  refundPayment,
} from '../controllers/payment.controller.js';

const router = express.Router();

/**
 * @route   POST /api/payment/create-order
 * @desc    Create a new Razorpay order
 * @access  Public (or Protected if user auth required)
 */
router.post('/create-order', createOrder);

/**
 * @route   POST /api/payment/verify
 * @desc    Verify payment signature after successful payment
 * @access  Public
 */
router.post('/verify', verifyPayment);

/**
 * @route   GET /api/payment/:paymentId
 * @desc    Get payment details by payment ID
 * @access  Public
 */
router.get('/:paymentId', getPaymentDetails);

/**
 * @route   GET /api/payment/order/:orderId
 * @desc    Get order details by order ID
 * @access  Public
 */
router.get('/order/:orderId', getOrderDetails);

/**
 * @route   POST /api/payment/refund
 * @desc    Process a refund for a payment
 * @access  Public (or Protected for admin only)
 */
router.post('/refund', refundPayment);

export default router;

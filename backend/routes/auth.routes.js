import express from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  forgotPassword,
  resetPassword,
  verifyResetToken
} from '../controllers/auth.controller.js';
import { sendEmailOTP, verifyEmailOTP } from '../controllers/otp.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validateUserRegistration, validateUserLogin, validateUpdateProfile } from '../middleware/validation.middleware.js';

const router = express.Router();

router.post('/register', validateUserRegistration, register);
router.post('/login', validateUserLogin, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, validateUpdateProfile, updateProfile);

// Password reset routes
router.post('/forgot-password', forgotPassword);
router.get('/verify-reset-token', verifyResetToken);
router.post('/reset-password', resetPassword);

// Email OTP verification routes
router.post('/send-email-otp', sendEmailOTP);
router.post('/verify-email-otp', verifyEmailOTP);

export default router;

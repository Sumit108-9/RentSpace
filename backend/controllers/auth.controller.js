import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/user.model.js';
import Otp from '../models/otp.model.js';
import PasswordReset from '../models/passwordReset.model.js';
import { body, validationResult } from 'express-validator';
import { sendWelcomeEmail, sendPasswordResetEmail, sendVerificationEmail, sendPasswordChangedEmail } from '../services/email.service.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

export const register = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { name, email, password, phone } = req.body;

      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists' });
      }

      const user = await User.create({
        name,
        email,
        password,
        phone,
        role: 'user'
      });

      // Send response immediately - don't wait for OTP/email
      res.status(201).json({
        success: true,
        message: 'User registered successfully. Please verify your email with OTP.',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          isEmailVerified: false
        }
      });

      // Generate and send OTP for email verification (fire-and-forget)
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      Otp.create({ email, otp })
        .then(() => sendVerificationEmail(email, otp))
        .then(() => console.log('✅ Verification email sent to:', email))
        .catch(emailError => {
          console.error('Failed to send verification email:', emailError.message);
        });
    } catch (error) {
      next(error);
    }
  }
];

export const login = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { email, password } = req.body;
      console.log('Login attempt:', { email, passwordLength: password?.length });

      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        console.log('User not found:', email);
        return res.status(401).json({ success: false, message: 'Invalid credentials - user not found' });
      }

      const isMatch = await user.comparePassword(password);
      console.log('Password match:', isMatch);
      if (!isMatch) {
        console.log('Wrong password for:', email);
        return res.status(401).json({ success: false, message: 'Invalid credentials - wrong password' });
      }

      res.json({
        success: true,
        message: 'Login successful',
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          address: user.address,
          wishlist: user.wishlist
        }
      });
    } catch (error) {
      next(error);
    }
  }
];

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        wishlist: user.wishlist
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, address },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Forgot Password - Send reset link
 * @route  POST /api/auth/forgot-password
 * @access Public
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    console.log('Forgot password request for email:', email);

    // Find user by email (could be regular user or admin)
    const user = await User.findOne({ email });
    console.log('User found:', user ? 'Yes' : 'No', 'Role:', user?.role);
    
    if (!user) {
      // Return user not found status
      return res.status(404).json({
        success: false,
        message: 'User not found',
        userExists: false
      });
    }

    // Delete any existing reset tokens for this user
    await PasswordReset.deleteMany({ user: user._id });

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    console.log('Generated reset token');

    // Create password reset record
    await PasswordReset.create({
      user: user._id,
      token: resetToken
    });
    console.log('Password reset record created');

    // Send reset email
    try {
      await sendPasswordResetEmail(user, resetToken);
      console.log('Reset email sent successfully');
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError.message);
      // Don't fail the request if email fails
    }

    const userType = user.role === 'admin' ? 'Admin' : 'User';
    res.status(200).json({
      success: true,
      message: `Password reset instructions sent to ${userType} email: ${user.email}`,
      userExists: true,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    next(error);
  }
};

/**
 * @desc   Verify reset token
 * @route  GET /api/auth/verify-reset-token
 * @access Public
 */
export const verifyResetToken = async (req, res, next) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Reset token is required'
      });
    }

    // Find valid token and populate user
    const resetRecord = await PasswordReset.findOne({
      token,
      isUsed: false
    }).populate('user', 'email name');

    if (!resetRecord || resetRecord.isExpired()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Token is valid',
      email: resetRecord.user?.email
    });
  } catch (error) {
    console.error('Verify token error:', error);
    next(error);
  }
};

/**
 * @desc   Reset Password
 * @route  POST /api/auth/reset-password
 * @access Public
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    // Validation
    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required'
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      });
    }

    // Find valid token
    const resetRecord = await PasswordReset.findOne({
      token,
      isUsed: false
    }).populate('user');

    if (!resetRecord || resetRecord.isExpired()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Get user
    const user = resetRecord.user;

    // Update password
    user.password = newPassword;
    await user.save();

    // Mark token as used
    resetRecord.isUsed = true;
    await resetRecord.save();

    // Delete all other reset tokens for this user (cleanup)
    await PasswordReset.deleteMany({ 
      user: user._id, 
      _id: { $ne: resetRecord._id }
    });

    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully. Please login with your new password.'
    });

    // Send password changed confirmation email (fire-and-forget)
    sendPasswordChangedEmail(user).catch(err => {
      console.error('Failed to send password changed email:', err.message);
    });
  } catch (error) {
    next(error);
  }
};

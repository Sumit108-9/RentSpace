import Otp from '../models/otp.model.js';
import User from '../models/user.model.js';
import { sendVerificationEmail } from '../services/email.service.js';

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * @desc   Send email OTP
 * @route  POST /api/auth/send-email-otp
 * @access Public
 */
export const sendEmailOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return res.status(400).json({ success: false, message: 'Email already verified' });
    }

    // Delete any existing OTP for this email
    await Otp.deleteMany({ email });

    // Generate new OTP
    const otp = generateOTP();

    // Save OTP to database
    await Otp.create({
      email,
      otp
    });

    // Send OTP via email
    await sendVerificationEmail(email, otp);

    res.json({
      success: true,
      message: 'OTP sent to email'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Verify email OTP
 * @route  POST /api/auth/verify-email-otp
 * @access Public
 */
export const verifyEmailOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    // Find OTP record
    const otpRecord = await Otp.findOne({ email });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'OTP expired or not found' });
    }

    // Check if OTP matches
    if (otpRecord.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    // Check if OTP is expired
    if (new Date() > otpRecord.expiresAt) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ success: false, message: 'OTP expired' });
    }

    // Update user as verified
    await User.findOneAndUpdate(
      { email },
      { isEmailVerified: true }
    );

    // Delete OTP record
    await Otp.deleteOne({ _id: otpRecord._id });

    res.json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    next(error);
  }
};

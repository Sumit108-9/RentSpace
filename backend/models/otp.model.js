import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true
  },
  otp: {
    type: String,
    required: [true, 'OTP is required']
  },
  expiresAt: {
    type: Date,
    required: true,
    default: function() {
      // OTP expires in 5 minutes
      return new Date(Date.now() + 5 * 60 * 1000);
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index to automatically expire OTP documents
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
// Index for faster email lookups
otpSchema.index({ email: 1 });

const Otp = mongoose.model('Otp', otpSchema);
export default Otp;

import nodemailer from 'nodemailer';

// Email configuration
export const emailConfig = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
};

// Create transporter
export const transporter = nodemailer.createTransport(emailConfig);

// Verify connection
export const verifyEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log('✅ Email server ready');
    return true;
  } catch (error) {
    console.error('❌ Email connection failed:', error.message);
    return false;
  }
};

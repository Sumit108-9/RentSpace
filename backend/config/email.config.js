import nodemailer from 'nodemailer';

// Email configuration
export const emailConfig = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
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
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️  Email credentials not configured - emails will be disabled');
    return false;
  }
  
  try {
    await transporter.verify();
    console.log('✅ Email server ready');
    return true;
  } catch (error) {
    console.error('❌ Email connection failed:', error.message);
    console.error('   Make sure EMAIL_USER and EMAIL_PASS are correct');
    console.error('   For Gmail, use an App Password (not your regular password)');
    return false;
  }
};

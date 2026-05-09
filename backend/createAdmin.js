/**
 * Script to create initial admin user in MongoDB
 * Run this once after setting up the database
 * 
 * Usage: node createAdmin.js
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

// Import User model
import User from './models/user.model.js';

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('ℹ️ Admin user already exists:', existingAdmin.email);
      console.log('No action needed.');
      process.exit(0);
    }

    // Create admin user
    const adminData = {
      name: 'Administrator',
      email: process.env.ADMIN_EMAIL || 'admin@rentspace.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      phone: '0000000000',
      role: 'admin',
      isEmailVerified: true
    };

    // Hash password
    const salt = await bcrypt.genSalt(10);
    adminData.password = await bcrypt.hash(adminData.password, salt);

    // Create admin
    const admin = await User.create(adminData);
    console.log('✅ Admin user created successfully!');
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('');
    console.log('You can now log in with these credentials.');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createAdmin();

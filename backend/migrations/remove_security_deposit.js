/**
 * Migration script to remove securityDeposit field from all products
 * Run: node backend/migrations/remove_security_deposit.js
 */

import mongoose from 'mongoose';
import Product from '../models/product.model.js';
import dotenv from 'dotenv';

dotenv.config();

const removeSecurityDeposit = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/rentspace';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully!');

    // Remove securityDeposit field from all products
    const result = await Product.updateMany(
      {}, // all products
      { $unset: { securityDeposit: 1 } }
    );

    console.log(`Migration completed!`);
    console.log(`- Matched: ${result.matchedCount} documents`);
    console.log(`- Modified: ${result.modifiedCount} documents`);

    // Verify by checking a sample product
    const sample = await Product.findOne().lean();
    console.log('Sample product (securityDeposit should be undefined):', {
      _id: sample._id,
      name: sample.name,
      securityDeposit: sample.securityDeposit
    });

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
    process.exit(0);
  }
};

// Run migration
removeSecurityDeposit();

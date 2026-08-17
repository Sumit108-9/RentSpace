import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/product.model.js';
import fs from 'fs';

dotenv.config();

const clearAndImport = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Clear all products
    await Product.deleteMany({});
    console.log('🗑️  Cleared all products');

    // Read seed-products.json
    const productsData = JSON.parse(fs.readFileSync('./seed-products.json', 'utf-8'));
    console.log(`📦 Found ${productsData.length} products in seed-products.json`);

    // Insert new products
    await Product.insertMany(productsData);
    console.log(`✅ Successfully imported ${productsData.length} products`);

    // Verify
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });
    console.log(`\n📊 Total products: ${totalProducts}`);
    console.log(`✅ Active products: ${activeProducts}`);

    const categories = ['sofa', 'bed', 'table', 'chair', 'wardrobe', 'dining', 'storage', 'decor'];
    console.log('\n📊 Products by category:');
    for (const category of categories) {
      const count = await Product.countDocuments({ category, isActive: true });
      console.log(`   ${category}: ${count}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

clearAndImport();

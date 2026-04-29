import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/product.model.js';

dotenv.config();

const sampleProducts = [
  {
    name: 'Premium Leather Sofa - 3 Seater',
    description: 'Experience ultimate comfort with our premium leather sofa. Features high-quality genuine leather upholstery, sturdy wooden frame, and plush cushioning. Perfect for your living room.',
    category: 'sofa',
    subcategory: '3-seater',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
      'https://images.unsplash.com/photo-1550254478-ead40cc54513?w=800'
    ],
    monthlyRent: 1299,
    securityDeposit: 5000,
    originalPrice: 45000,
    rating: 4.8,
    numReviews: 124,
    countInStock: 15,
    features: ['Genuine Leather', 'Sturdy Frame', 'Plush Cushions', 'Easy Clean'],
    dimensions: { length: 210, width: 90, height: 85 },
    material: 'Genuine Leather',
    color: 'Brown',
    isActive: true,
    isFeatured: true,
    minRentalPeriod: 3,
    maxRentalPeriod: 24
  },
  {
    name: 'Modern Fabric Sofa - L Shape',
    description: 'Contemporary L-shaped sofa with premium fabric upholstery. Modular design allows flexible arrangement. Includes throw pillows.',
    category: 'sofa',
    subcategory: 'l-shape',
    images: [
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800',
      'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800'
    ],
    monthlyRent: 1899,
    securityDeposit: 8000,
    originalPrice: 65000,
    rating: 4.7,
    numReviews: 89,
    countInStock: 10,
    features: ['Modular Design', 'Premium Fabric', 'Throw Pillows', 'Easy Assembly'],
    dimensions: { length: 240, width: 180, height: 80 },
    material: 'Polyester Blend',
    color: 'Grey',
    isActive: true,
    isFeatured: true,
    minRentalPeriod: 6,
    maxRentalPeriod: 24
  },
  {
    name: 'Queen Size Bed with Storage',
    description: 'Elegant queen size bed with hydraulic storage. Upholstered headboard, solid wood construction, and ample storage space.',
    category: 'bed',
    subcategory: 'queen',
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800',
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800'
    ],
    monthlyRent: 1499,
    securityDeposit: 6000,
    originalPrice: 52000,
    rating: 4.9,
    numReviews: 156,
    countInStock: 8,
    features: ['Hydraulic Storage', 'Upholstered Headboard', 'Solid Wood', 'No Box Spring Needed'],
    dimensions: { length: 203, width: 152, height: 110 },
    material: 'Engineered Wood',
    color: 'Beige',
    isActive: true,
    isFeatured: true,
    minRentalPeriod: 6,
    maxRentalPeriod: 24
  },
  {
    name: 'Single Bed with Mattress',
    description: 'Compact single bed perfect for small spaces. Includes comfortable foam mattress and sturdy metal frame.',
    category: 'bed',
    subcategory: 'single',
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800'
    ],
    monthlyRent: 699,
    securityDeposit: 2500,
    originalPrice: 18000,
    rating: 4.5,
    numReviews: 78,
    countInStock: 20,
    features: ['Includes Mattress', 'Metal Frame', 'Compact Size', 'Easy Move'],
    dimensions: { length: 198, width: 91, height: 40 },
    material: 'Metal',
    color: 'Black',
    isActive: true,
    isFeatured: false,
    minRentalPeriod: 3,
    maxRentalPeriod: 24
  },
  {
    name: 'Dining Table Set - 4 Seater',
    description: 'Modern dining table set with 4 comfortable chairs. Tempered glass top with metal legs. Perfect for family meals.',
    category: 'dining',
    subcategory: '4-seater',
    images: [
      'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=800',
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800'
    ],
    monthlyRent: 899,
    securityDeposit: 4000,
    originalPrice: 28000,
    rating: 4.6,
    numReviews: 92,
    countInStock: 12,
    features: ['Tempered Glass', '4 Chairs', 'Metal Frame', 'Easy Clean'],
    dimensions: { length: 120, width: 75, height: 75 },
    material: 'Glass & Metal',
    color: 'Clear/Black',
    isActive: true,
    isFeatured: true,
    minRentalPeriod: 3,
    maxRentalPeriod: 24
  },
  {
    name: 'Study Desk with Chair',
    description: 'Ergonomic study desk with matching chair. Built-in drawer storage and cable management. Ideal for work from home.',
    category: 'table',
    subcategory: 'study',
    images: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800'
    ],
    monthlyRent: 549,
    securityDeposit: 2000,
    originalPrice: 15000,
    rating: 4.4,
    numReviews: 67,
    countInStock: 25,
    features: ['Ergonomic Chair', 'Drawer Storage', 'Cable Management', 'Compact'],
    dimensions: { length: 100, width: 60, height: 75 },
    material: 'Engineered Wood',
    color: 'White',
    isActive: true,
    isFeatured: false,
    minRentalPeriod: 3,
    maxRentalPeriod: 24
  },
  {
    name: '3-Door Wardrobe with Mirror',
    description: 'Spacious 3-door wardrobe with full-length mirror. Multiple compartments, hanging rods, and drawers.',
    category: 'wardrobe',
    subcategory: '3-door',
    images: [
      'https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=800'
    ],
    monthlyRent: 999,
    securityDeposit: 4500,
    originalPrice: 32000,
    rating: 4.5,
    numReviews: 71,
    countInStock: 10,
    features: ['Full Mirror', '3 Doors', 'Multiple Shelves', 'Lockable Drawers'],
    dimensions: { length: 150, width: 60, height: 200 },
    material: 'Engineered Wood',
    color: 'Walnut',
    isActive: true,
    isFeatured: true,
    minRentalPeriod: 3,
    maxRentalPeriod: 24
  },
  {
    name: 'Coffee Table - Modern Design',
    description: 'Stylish coffee table with storage shelf. Perfect centerpiece for your living room.',
    category: 'table',
    subcategory: 'coffee',
    images: [
      'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800'
    ],
    monthlyRent: 399,
    securityDeposit: 1500,
    originalPrice: 12000,
    rating: 4.3,
    numReviews: 45,
    countInStock: 30,
    features: ['Storage Shelf', 'Modern Design', 'Easy Assembly', 'Durable'],
    dimensions: { length: 100, width: 60, height: 45 },
    material: 'Wood',
    color: 'Natural',
    isActive: true,
    isFeatured: false,
    minRentalPeriod: 3,
    maxRentalPeriod: 24
  },
  {
    name: 'Accent Chair - Velvet',
    description: 'Elegant velvet accent chair with gold metal legs. Adds a touch of luxury to any room.',
    category: 'chair',
    subcategory: 'accent',
    images: [
      'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800'
    ],
    monthlyRent: 599,
    securityDeposit: 2500,
    originalPrice: 18000,
    rating: 4.8,
    numReviews: 52,
    countInStock: 15,
    features: ['Velvet Fabric', 'Gold Legs', 'Ergonomic', 'Statement Piece'],
    dimensions: { length: 70, width: 75, height: 85 },
    material: 'Velvet & Metal',
    color: 'Emerald Green',
    isActive: true,
    isFeatured: true,
    minRentalPeriod: 3,
    maxRentalPeriod: 24
  },
  {
    name: 'Bookshelf - 5 Tier',
    description: 'Tall 5-tier bookshelf for your library. Open back design, perfect for books and decor.',
    category: 'storage',
    subcategory: 'bookshelf',
    images: [
      'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800'
    ],
    monthlyRent: 499,
    securityDeposit: 2000,
    originalPrice: 14000,
    rating: 4.4,
    numReviews: 38,
    countInStock: 18,
    features: ['5 Tiers', 'Open Back', 'Sturdy', 'Easy Assembly'],
    dimensions: { length: 80, width: 30, height: 180 },
    material: 'Wood',
    color: 'White',
    isActive: true,
    isFeatured: false,
    minRentalPeriod: 3,
    maxRentalPeriod: 24
  },
  {
    name: 'TV Unit - Entertainment Center',
    description: 'Modern TV unit with cabinets and open shelves. Fits TVs up to 55 inches.',
    category: 'storage',
    subcategory: 'tv-unit',
    images: [
      'https://images.unsplash.com/photo-1611486212557-88be5ff6f941?w=800'
    ],
    monthlyRent: 699,
    securityDeposit: 3000,
    originalPrice: 22000,
    rating: 4.5,
    numReviews: 64,
    countInStock: 14,
    features: ['Cable Management', 'Storage Cabinets', 'Open Shelves', 'Modern Design'],
    dimensions: { length: 150, width: 40, height: 50 },
    material: 'Engineered Wood',
    color: 'Dark Brown',
    isActive: true,
    isFeatured: false,
    minRentalPeriod: 3,
    maxRentalPeriod: 24
  },
  {
    name: 'Dining Chairs Set of 2',
    description: 'Elegant dining chairs with cushioned seats. Set of 2 for your dining area.',
    category: 'chair',
    subcategory: 'dining',
    images: [
      'https://images.unsplash.com/photo-1503602642458-232111445657?w=800'
    ],
    monthlyRent: 449,
    securityDeposit: 1500,
    originalPrice: 10000,
    rating: 4.2,
    numReviews: 29,
    countInStock: 20,
    features: ['Set of 2', 'Cushioned Seat', 'Ergonomic', 'Easy Clean'],
    dimensions: { length: 45, width: 50, height: 95 },
    material: 'Wood & Fabric',
    color: 'Beige',
    isActive: true,
    isFeatured: false,
    minRentalPeriod: 3,
    maxRentalPeriod: 24
  },
  {
    name: '2 Seater Loveseat Sofa',
    description: 'Cozy 2-seater loveseat with plush cushioning. Perfect for small spaces and apartments.',
    category: 'sofa',
    subcategory: '2-seater',
    images: [
      'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800'
    ],
    monthlyRent: 749,
    securityDeposit: 3500,
    originalPrice: 18000,
    rating: 4.5,
    numReviews: 63,
    countInStock: 18,
    features: ['Plush Cushions', 'Compact Design', 'Wooden Legs'],
    dimensions: { length: 150, width: 80, height: 80 },
    material: 'Fabric & Wood',
    color: 'Beige',
    isActive: true,
    isFeatured: true,
    minRentalPeriod: 3,
    maxRentalPeriod: 24
  },
  {
    name: 'King Size Bed - Premium',
    description: 'Luxurious king size bed with tufted headboard. Spacious and elegant for the master bedroom.',
    category: 'bed',
    subcategory: 'king',
    images: [
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800'
    ],
    monthlyRent: 1899,
    securityDeposit: 8000,
    originalPrice: 45000,
    rating: 4.9,
    numReviews: 112,
    countInStock: 6,
    features: ['Tufted Headboard', 'Solid Wood', 'Storage Drawers'],
    dimensions: { length: 203, width: 183, height: 120 },
    material: 'Solid Wood',
    color: 'Dark Walnut',
    isActive: true,
    isFeatured: true,
    minRentalPeriod: 6,
    maxRentalPeriod: 24
  },
  {
    name: 'Dining Chair Set (4 Pcs)',
    description: 'Set of 4 modern dining chairs with ergonomic design and durable construction.',
    category: 'chair',
    subcategory: 'dining',
    images: [
      'https://images.unsplash.com/photo-1503602642458-232111445657?w=800'
    ],
    monthlyRent: 599,
    securityDeposit: 2500,
    originalPrice: 16000,
    rating: 4.4,
    numReviews: 48,
    countInStock: 22,
    features: ['Set of 4', 'Ergonomic', 'Easy Clean'],
    dimensions: { length: 45, width: 50, height: 95 },
    material: 'Wood & Fabric',
    color: 'Grey',
    isActive: true,
    isFeatured: false,
    minRentalPeriod: 3,
    maxRentalPeriod: 24
  },
  {
    name: 'Ergonomic Office Chair',
    description: 'High-back ergonomic office chair with lumbar support, adjustable height, and breathable mesh.',
    category: 'chair',
    subcategory: 'office',
    images: [
      'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=800'
    ],
    monthlyRent: 699,
    securityDeposit: 3000,
    originalPrice: 17000,
    rating: 4.7,
    numReviews: 94,
    countInStock: 20,
    features: ['Lumbar Support', 'Adjustable Height', 'Mesh Back'],
    dimensions: { length: 65, width: 65, height: 110 },
    material: 'Mesh & Metal',
    color: 'Black',
    isActive: true,
    isFeatured: true,
    minRentalPeriod: 3,
    maxRentalPeriod: 24
  },
  {
    name: 'Bedside Nightstand Table',
    description: 'Compact bedside nightstand with drawer storage. Perfect companion for your bed.',
    category: 'table',
    subcategory: 'nightstand',
    images: [
      'https://images.unsplash.com/photo-1551298370-9d3d53740c72?w=800'
    ],
    monthlyRent: 299,
    securityDeposit: 1000,
    originalPrice: 7500,
    rating: 4.3,
    numReviews: 35,
    countInStock: 40,
    features: ['Drawer Storage', 'Compact', 'Sturdy'],
    dimensions: { length: 45, width: 40, height: 55 },
    material: 'Engineered Wood',
    color: 'Oak',
    isActive: true,
    isFeatured: false,
    minRentalPeriod: 3,
    maxRentalPeriod: 24
  },
  {
    name: 'Shoe Rack Cabinet',
    description: '5-tier shoe rack cabinet with ventilation. Holds up to 20 pairs of shoes elegantly.',
    category: 'storage',
    subcategory: 'shoe-rack',
    images: [
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800'
    ],
    monthlyRent: 349,
    securityDeposit: 1500,
    originalPrice: 9000,
    rating: 4.2,
    numReviews: 29,
    countInStock: 25,
    features: ['5 Tiers', 'Ventilated', '20 Pairs Capacity'],
    dimensions: { length: 70, width: 35, height: 120 },
    material: 'Engineered Wood',
    color: 'White',
    isActive: true,
    isFeatured: false,
    minRentalPeriod: 3,
    maxRentalPeriod: 24
  },
  {
    name: 'Recliner Sofa - Single',
    description: 'Luxurious single recliner with plush padding. Manual reclining mechanism with footrest.',
    category: 'sofa',
    subcategory: 'recliner',
    images: [
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800'
    ],
    monthlyRent: 1099,
    securityDeposit: 5000,
    originalPrice: 28000,
    rating: 4.7,
    numReviews: 76,
    countInStock: 10,
    features: ['Manual Recline', 'Footrest', 'Plush Padding'],
    dimensions: { length: 90, width: 90, height: 100 },
    material: 'Leatherette',
    color: 'Tan Brown',
    isActive: true,
    isFeatured: true,
    minRentalPeriod: 3,
    maxRentalPeriod: 24
  },
  {
    name: 'Sideboard Cabinet',
    description: 'Elegant sideboard cabinet with 3 doors and drawers. Perfect for dining room storage.',
    category: 'storage',
    subcategory: 'sideboard',
    images: [
      'https://images.unsplash.com/photo-1616627561950-9f746e330187?w=800'
    ],
    monthlyRent: 899,
    securityDeposit: 4000,
    originalPrice: 24000,
    rating: 4.6,
    numReviews: 41,
    countInStock: 12,
    features: ['3 Doors', 'Multiple Drawers', 'Solid Wood'],
    dimensions: { length: 150, width: 45, height: 80 },
    material: 'Solid Wood',
    color: 'Walnut',
    isActive: true,
    isFeatured: false,
    minRentalPeriod: 3,
    maxRentalPeriod: 24
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Product.deleteMany();
    console.log('Deleted existing products');

    await Product.insertMany(sampleProducts);
    console.log('Sample products added successfully');

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();

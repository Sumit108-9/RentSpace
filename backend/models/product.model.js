import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['sofa', 'bed', 'table', 'chair', 'wardrobe', 'decor', 'dining', 'storage']
  },
  subcategory: {
    type: String,
    trim: true
  },
  images: [{
    type: String,
    required: true
  }],
  monthlyRent: {
    type: Number,
    required: [true, 'Monthly rent is required'],
    min: 0
  },
  securityDeposit: {
    type: Number,
    default: 0,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  reviews: [reviewSchema],
  countInStock: {
    type: Number,
    required: true,
    default: 10,
    min: 0
  },
  features: [{
    type: String
  }],
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: { type: String, default: 'cm' }
  },
  material: {
    type: String
  },
  color: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  minRentalPeriod: {
    type: Number,
    default: 3,
    min: 1
  },
  maxRentalPeriod: {
    type: Number,
    default: 24,
    min: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Product = mongoose.model('Product', productSchema);
export default Product;

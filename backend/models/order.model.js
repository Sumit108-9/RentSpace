import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  monthlyRent: {
    type: Number,
    required: true
  },
  rentalDuration: {
    type: Number,
    required: true,
    min: 1
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
    min: 1
  }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderItems: [orderItemSchema],
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, default: 'India' }
  },
  contactInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  paymentInfo: {
    id: String,
    status: String,
    method: {
      type: String,
      enum: ['card', 'upi', 'netbanking', 'cod'],
      required: true
    }
  },
  itemsTotal: {
    type: Number,
    required: true,
    default: 0
  },
  securityDeposit: {
    type: Number,
    required: true,
    default: 0
  },
  deliveryFee: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  couponCode: {
    type: String
  },
  totalAmount: {
    type: Number,
    required: true,
    default: 0
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  rentalStartDate: {
    type: Date
  },
  rentalEndDate: {
    type: Date
  },
  deliveredAt: {
    type: Date
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model('Order', orderSchema);
export default Order;

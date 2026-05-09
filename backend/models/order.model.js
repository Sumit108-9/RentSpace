import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: String,
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
  orderId: {
    type: String,
    unique: true,
    index: true
  },
  orderNumber: {
    type: String,
    unique: true,
    index: true,
    sparse: true
  },
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
      enum: ['card', 'upi', 'netbanking', 'cod', 'razorpay'],
      required: true
    }
  },
  // Razorpay specific fields
  razorpayOrderId: {
    type: String,
    index: true
  },
  razorpayPaymentId: {
    type: String,
    index: true
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paidAt: {
    type: Date
  },
  paymentDetails: {
    // Stores detailed payment info from Razorpay
    method: String,
    amount: Number,
    currency: String,
    status: String,
    captured: Boolean,
    card: {
      network: String,
      last4: String,
      type: String
    },
    upi: {
      vpa: String,
      flow: String
    },
    bank: String,
    wallet: String,
    fee: Number,
    tax: Number,
    error: String,
    created_at: Number
  },
  refundDetails: {
    refundId: String,
    amount: Number,
    status: String,
    reason: String,
    createdAt: Date
  },
  itemsTotal: {
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
    enum: ['pending', 'pending_payment', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned', 'payment_failed'],
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

// Performance indexes for high-traffic queries
orderSchema.index({ user: 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1, createdAt: -1 });
orderSchema.index({ isPaid: 1 });
orderSchema.index({ 'orderItems.product': 1 });

const Order = mongoose.model('Order', orderSchema);
export default Order;

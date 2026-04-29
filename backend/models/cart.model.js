import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: String,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    rentalDuration: {
      type: Number,
      required: true,
      min: 1,
      default: 1, // months
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

// Helper method: get total monthly rent (sum of product.monthlyRent * qty * duration)
// Note: this requires items to be populated
cartSchema.methods.computeTotals = function () {
  let subtotal = 0;
  let itemCount = 0;

  for (const item of this.items) {
    const product = item.product;
    if (product && typeof product === 'object' && product.monthlyRent != null) {
      subtotal += (product.monthlyRent || 0) * item.quantity * item.rentalDuration;
    }
    itemCount += item.quantity;
  }

  return { subtotal, itemCount };
};

// Performance indexes
cartSchema.index({ 'items.product': 1 });
cartSchema.index({ updatedAt: -1 });

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;

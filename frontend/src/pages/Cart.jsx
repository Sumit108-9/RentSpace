import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Package } from 'lucide-react';
import useStore from '../store/useStore';
import toast from 'react-hot-toast';

const Cart = () => {
  const { 
    cart, 
    removeFromCart, 
    updateCartItemQuantity, 
    updateCartItemDuration,
    getCartTotal,
    getSecurityDeposit,
    getCartCount,
    isAuthenticated 
  } = useStore();
  const navigate = useNavigate();

  const cartTotal = getCartTotal();
  const securityDeposit = getSecurityDeposit();
  const cartCount = getCartCount();
  const deliveryFee = cartTotal > 5000 ? 0 : 299;
  const grandTotal = cartTotal + securityDeposit + deliveryFee;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login to proceed');
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-secondary-50 py-16">
        <div className="container-custom text-center">
          <div className="w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-secondary-400" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-secondary-600 mb-8">Looks like you haven't added any items yet.</p>
          <Link to="/products" className="btn-primary">
            Continue Shopping
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart ({cartCount} items)</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => (
              <motion.div
                key={`${item.product._id}-${item.rentalDuration}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm"
              >
                <div className="flex gap-6">
                  <Link to={`/products/${item.product._id}`} className="w-32 h-32 flex-shrink-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </Link>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <Link 
                        to={`/products/${item.product._id}`}
                        className="font-semibold text-lg hover:text-primary-600"
                      >
                        {item.product.name}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.product._id, item.rentalDuration)}
                        className="text-red-500 hover:text-red-600 p-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <p className="text-secondary-600 mb-4">
                      ₹{item.product.monthlyRent}/month × {item.rentalDuration} months
                    </p>

                    <div className="flex flex-wrap items-center gap-6">
                      <div>
                        <label className="text-sm text-secondary-500 block mb-1">Quantity</label>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateCartItemQuantity(item.product._id, item.rentalDuration, Math.max(1, item.quantity - 1))}
                            className="w-8 h-8 rounded bg-secondary-100 flex items-center justify-center hover:bg-secondary-200"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateCartItemQuantity(item.product._id, item.rentalDuration, item.quantity + 1)}
                            className="w-8 h-8 rounded bg-secondary-100 flex items-center justify-center hover:bg-secondary-200"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm text-secondary-500 block mb-1">Duration</label>
                        <select
                          value={item.rentalDuration}
                          onChange={(e) => updateCartItemDuration(item.product._id, item.rentalDuration, parseInt(e.target.value))}
                          className="border border-secondary-200 rounded-lg px-3 py-1"
                        >
                          {[3, 6, 9, 12, 18, 24].map(m => (
                            <option key={m} value={m}>{m} months</option>
                          ))}
                        </select>
                      </div>

                      <div className="ml-auto text-right">
                        <p className="text-2xl font-bold">
                          ₹{item.product.monthlyRent * item.rentalDuration * item.quantity}
                        </p>
                        {item.product.securityDeposit > 0 && (
                          <p className="text-sm text-secondary-500">
                            + ₹{item.product.securityDeposit * item.quantity} deposit
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-secondary-600">Subtotal</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Security Deposit</span>
                  <span>₹{securityDeposit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Delivery Fee</span>
                  <span className={deliveryFee === 0 ? 'text-green-600' : ''}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>
                {deliveryFee > 0 && (
                  <p className="text-xs text-secondary-500">
                    Free delivery on orders above ₹5000
                  </p>
                )}
              </div>

              <div className="border-t border-secondary-200 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total</span>
                  <span className="text-2xl font-bold text-primary-600">₹{grandTotal}</span>
                </div>
                <p className="text-xs text-secondary-500 mt-1">
                  (incl. refundable deposit)
                </p>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full btn-primary py-4 text-lg"
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>

              <Link 
                to="/products" 
                className="block text-center mt-4 text-secondary-600 hover:text-primary-600"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

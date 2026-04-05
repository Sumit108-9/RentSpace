import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, MapPin, Truck, Shield, Check, ArrowRight } from 'lucide-react';
import useStore from '../store/useStore';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, getSecurityDeposit, clearCart, user } = useStore();
  
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    // Contact Info
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    // Address
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    // Payment
    paymentMethod: 'card',
    // Rental
    rentalStartDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  const cartTotal = getCartTotal();
  const securityDeposit = getSecurityDeposit();
  const deliveryFee = cartTotal > 5000 ? 0 : 299;
  const grandTotal = cartTotal + securityDeposit + deliveryFee;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-secondary-50 py-16">
        <div className="container-custom text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <button onClick={() => navigate('/products')} className="btn-primary">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setIsProcessing(true);
    try {
      const orderData = {
        orderItems: cart.map(item => ({
          productId: item.product._id,
          quantity: item.quantity,
          rentalDuration: item.rentalDuration
        })),
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: 'India'
        },
        contactInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        },
        paymentMethod: formData.paymentMethod,
        rentalStartDate: formData.rentalStartDate
      };

      const res = await api.post('/orders', orderData);
      
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/payment/success', { state: { order: res.data.order } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setIsProcessing(false);
    }
  };

  const steps = [
    { number: 1, title: 'Contact', icon: MapPin },
    { number: 2, title: 'Address', icon: Truck },
    { number: 3, title: 'Payment', icon: CreditCard }
  ];

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((s, idx) => (
            <React.Fragment key={s.number}>
              <div className={`flex items-center gap-2 ${step >= s.number ? 'text-primary-600' : 'text-secondary-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= s.number ? 'bg-primary-600 text-white' : 'bg-secondary-200'
                }`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <span className="font-medium hidden sm:block">{s.title}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`w-12 sm:w-24 h-1 mx-2 sm:mx-4 ${
                  step > s.number ? 'bg-primary-600' : 'bg-secondary-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm">
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h2 className="text-xl font-bold mb-6">Contact Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="input"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Phone *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="input"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h2 className="text-xl font-bold mb-6">Shipping Address</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Street Address *</label>
                      <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleInputChange}
                        required
                        className="input"
                        placeholder="House number, building, street name"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">City *</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className="input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">State *</label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                          className="input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">PIN Code *</label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          required
                          className="input"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Rental Start Date *</label>
                      <input
                        type="date"
                        name="rentalStartDate"
                        value={formData.rentalStartDate}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        required
                        className="input"
                      />
                      <p className="text-sm text-secondary-500 mt-1">
                        Delivery will be scheduled within 3-5 business days from this date
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h2 className="text-xl font-bold mb-6">Payment Method</h2>
                  <div className="space-y-3">
                    {[
                      { id: 'card', label: 'Credit/Debit Card', desc: 'Pay securely with your card' },
                      { id: 'upi', label: 'UPI', desc: 'Google Pay, PhonePe, Paytm' },
                      { id: 'netbanking', label: 'Net Banking', desc: 'All major banks supported' },
                      { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when you receive' }
                    ].map(method => (
                      <label
                        key={method.id}
                        className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                          formData.paymentMethod === method.id 
                            ? 'border-primary-600 bg-primary-50' 
                            : 'border-secondary-200 hover:border-secondary-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={formData.paymentMethod === method.id}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-primary-600"
                        />
                        <div className="ml-4">
                          <p className="font-medium">{method.label}</p>
                          <p className="text-sm text-secondary-500">{method.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center gap-2 p-4 bg-green-50 rounded-xl">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-700">
                      Your payment information is secure and encrypted
                    </span>
                  </div>
                </motion.div>
              )}

              <div className="flex items-center justify-between mt-8 pt-6 border-t border-secondary-200">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="text-secondary-600 hover:text-secondary-900"
                  >
                    Back
                  </button>
                ) : (
                  <div />
                )}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="btn-primary"
                >
                  {isProcessing ? (
                    'Processing...'
                  ) : step === 3 ? (
                    <>
                      Place Order
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={`${item.product._id}-${item.rentalDuration}`} className="flex gap-4">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm line-clamp-1">{item.product.name}</p>
                      <p className="text-sm text-secondary-500">
                        Qty: {item.quantity} × {item.rentalDuration} months
                      </p>
                      <p className="font-medium text-sm">
                        ₹{item.product.monthlyRent * item.rentalDuration * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-secondary-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-600">Subtotal</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-600">Security Deposit</span>
                  <span>₹{securityDeposit}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-600">Delivery</span>
                  <span className={deliveryFee === 0 ? 'text-green-600' : ''}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>
              </div>

              <div className="border-t border-secondary-200 mt-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold">Total</span>
                  <span className="text-2xl font-bold text-primary-600">₹{grandTotal}</span>
                </div>
                <p className="text-xs text-secondary-500 mt-1">
                  (incl. ₹{securityDeposit} refundable deposit)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

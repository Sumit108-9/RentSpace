import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight, Download } from 'lucide-react';

const PaymentSuccess = () => {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Order not found</h1>
          <Link to="/" className="btn-primary">Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-16">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-secondary-600 mb-8">
              Thank you for your order. We've sent a confirmation email to {order.contactInfo?.email}.
            </p>

            <div className="bg-secondary-50 rounded-xl p-6 mb-8 text-left">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-secondary-500">Order ID</p>
                  <p className="font-semibold">#{order._id.slice(-8).toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Order Date</p>
                  <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Total Amount</p>
                  <p className="font-semibold text-lg">₹{order.totalAmount}</p>
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Status</p>
                  <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                    {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                  </span>
                </div>
              </div>

              <div className="border-t border-secondary-200 pt-4">
                <p className="text-sm text-secondary-500 mb-2">Items ({order.orderItems.length})</p>
                {order.orderItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 py-2">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-secondary-500">Qty: {item.quantity} • {item.rentalDuration} months</p>
                    </div>
                    <p className="font-medium">₹{item.monthlyRent * item.rentalDuration}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/orders" className="btn-primary flex-1">
                <Package className="w-5 h-5 mr-2" />
                Track Order
              </Link>
              <Link to="/products" className="btn-outline flex-1">
                Continue Shopping
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentSuccess;

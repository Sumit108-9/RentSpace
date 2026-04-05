import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ChevronRight, Search, Filter, X, Eye, Truck, CheckCircle, Clock, AlertCircle, MapPin, Phone } from 'lucide-react';
import api from '../utils/api';
import useStore from '../store/useStore';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const Orders = () => {
  const navigate = useNavigate();
  const { user } = useStore();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [trackingDetails, setTrackingDetails] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [user, navigate, statusFilter, page]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', 10);
      if (statusFilter) params.append('status', statusFilter);

      const res = await api.get(`/orders?${params.toString()}`);
      setOrders(res.data.orders);
      setPagination(res.data.pagination);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'shipped': return <Truck className="w-5 h-5 text-blue-600" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-600" />;
      default: return <Package className="w-5 h-5 text-secondary-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'shipped': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-secondary-100 text-secondary-700';
    }
  };

  const handleTrackOrder = (order) => {
    setSelectedOrder(order);
    // Generate tracking timeline based on order status
    const timeline = generateTrackingTimeline(order);
    setTrackingDetails(timeline);
    setIsTrackModalOpen(true);
  };

  const generateTrackingTimeline = (order) => {
    const orderDate = new Date(order.createdAt);
    const events = [];
    
    // Order Placed
    events.push({
      status: 'Order Placed',
      date: orderDate,
      description: 'Your order has been confirmed and is being processed',
      completed: true,
      icon: 'check'
    });

    // Processing
    if (order.orderStatus !== 'cancelled') {
      events.push({
        status: 'Processing',
        date: new Date(orderDate.getTime() + 24 * 60 * 60 * 1000),
        description: 'Your order is being prepared for shipment',
        completed: ['confirmed', 'shipped', 'delivered'].includes(order.orderStatus),
        icon: 'processing'
      });
    }

    // Shipped
    if (['shipped', 'delivered'].includes(order.orderStatus)) {
      events.push({
        status: 'Shipped',
        date: order.shippedAt ? new Date(order.shippedAt) : new Date(orderDate.getTime() + 48 * 60 * 60 * 1000),
        description: 'Your order has been shipped and is on its way',
        completed: true,
        icon: 'truck'
      });
    } else if (order.orderStatus !== 'cancelled') {
      events.push({
        status: 'Shipped',
        date: null,
        description: 'Your order will be shipped soon',
        completed: false,
        icon: 'truck'
      });
    }

    // Out for Delivery
    if (order.orderStatus === 'delivered') {
      events.push({
        status: 'Out for Delivery',
        date: new Date(new Date(order.deliveredAt).getTime() - 2 * 60 * 60 * 1000),
        description: 'Your order is out for delivery',
        completed: true,
        icon: 'delivery'
      });
    } else if (order.orderStatus === 'shipped') {
      events.push({
        status: 'Out for Delivery',
        date: null,
        description: 'Expected soon',
        completed: false,
        icon: 'delivery'
      });
    }

    // Delivered
    if (order.orderStatus === 'delivered') {
      events.push({
        status: 'Delivered',
        date: order.deliveredAt ? new Date(order.deliveredAt) : new Date(),
        description: 'Your order has been delivered',
        completed: true,
        icon: 'delivered'
      });
    } else if (order.orderStatus !== 'cancelled') {
      events.push({
        status: 'Delivered',
        date: null,
        description: 'Expected delivery soon',
        completed: false,
        icon: 'delivered'
      });
    }

    return events;
  };

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Orders</h1>
          <Link to="/products" className="btn-primary">
            Continue Shopping
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-secondary-500">Filter by status:</span>
            {['', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(status => (
              <button
                key={status || 'all'}
                onClick={() => { setStatusFilter(status); setPage(1); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === status 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                }`}
              >
                {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'All Orders'}
              </button>
            ))}
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl">
            <Package className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No orders found</h2>
            <p className="text-secondary-500 mb-6">
              {statusFilter ? `No ${statusFilter} orders` : "You haven't placed any orders yet"}
            </p>
            <Link to="/products" className="btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order._id} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-secondary-100">
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
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.orderStatus)}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {order.orderItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-secondary-500">
                          Qty: {item.quantity} • {item.rentalDuration} months
                        </p>
                        <p className="text-sm font-medium">
                          ₹{item.monthlyRent} × {item.rentalDuration} = ₹{item.monthlyRent * item.rentalDuration}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-secondary-100 flex items-center justify-between">
                  <p className="text-sm text-secondary-500">
                    Rental Period: {new Date(order.rentalStartDate).toLocaleDateString()} - {order.rentalEndDate ? new Date(order.rentalEndDate).toLocaleDateString() : 'N/A'}
                  </p>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleTrackOrder(order)}
                      className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 bg-primary-50 hover:bg-primary-100 px-3 py-2 rounded-lg transition-colors"
                    >
                      <Truck className="w-4 h-4" /> Track Order
                    </button>
                    <button className="text-secondary-600 hover:text-secondary-700 font-medium flex items-center gap-1">
                      <Eye className="w-4 h-4" /> View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 border border-secondary-200 rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
                <span>Page {page} of {pagination.pages}</span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= pagination.pages}
                  className="px-4 py-2 border border-secondary-200 rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Track Order Modal */}
      {isTrackModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setIsTrackModalOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 animate-fade-in max-h-[85vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-secondary-100 flex items-center justify-between z-10">
              <div>
                <h3 className="text-xl font-bold text-secondary-900">Track Order</h3>
                <p className="text-sm text-secondary-500">Order #{selectedOrder._id.slice(-8).toUpperCase()}</p>
              </div>
              <button 
                onClick={() => setIsTrackModalOpen(false)}
                className="p-2 hover:bg-secondary-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-secondary-500" />
              </button>
            </div>

            {/* Tracking Timeline */}
            <div className="p-6">
              {trackingDetails?.map((event, index) => (
                <div key={index} className="flex gap-4 last:mb-0 mb-6">
                  {/* Timeline Line */}
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      event.completed 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-secondary-100 text-secondary-400'
                    }`}>
                      {event.icon === 'truck' && <Truck className="w-5 h-5" />}
                      {event.icon === 'check' && <CheckCircle className="w-5 h-5" />}
                      {event.icon === 'processing' && <Clock className="w-5 h-5" />}
                      {event.icon === 'delivery' && <MapPin className="w-5 h-5" />}
                      {event.icon === 'delivered' && <Package className="w-5 h-5" />}
                    </div>
                    {index < trackingDetails.length - 1 && (
                      <div className={`w-0.5 flex-1 my-2 ${
                        event.completed ? 'bg-green-300' : 'bg-secondary-200'
                      }`} />
                    )}
                  </div>

                  {/* Event Content */}
                  <div className="flex-1 pb-2">
                    <h4 className={`font-semibold ${
                      event.completed ? 'text-secondary-900' : 'text-secondary-400'
                    }`}>
                      {event.status}
                    </h4>
                    <p className={`text-sm mt-1 ${
                      event.completed ? 'text-secondary-600' : 'text-secondary-400'
                    }`}>
                      {event.description}
                    </p>
                    {event.date && (
                      <p className="text-xs text-secondary-400 mt-1">
                        {event.date.toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {/* Delivery Info */}
              <div className="mt-6 p-4 bg-secondary-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-secondary-500" />
                  <div>
                    <p className="text-sm font-medium text-secondary-700">Need help with your delivery?</p>
                    <p className="text-xs text-secondary-500">Contact our support team</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-secondary-100">
              <button
                onClick={() => setIsTrackModalOpen(false)}
                className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;

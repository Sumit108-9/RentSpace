import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  Package, 
  Heart, 
  MapPin, 
  Phone, 
  Mail, 
  Edit2, 
  LogOut,
  ChevronRight,
  Loader2,
  Check
} from 'lucide-react';
import api from '../utils/api';
import useStore from '../store/useStore';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, updateUser, logout, setAuth } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ totalOrders: 0, activeRentals: 0 });
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      const [userRes, ordersRes] = await Promise.all([
        api.get('/auth/me'),
        api.get('/orders?limit=3')
      ]);
      
      updateUser(userRes.data.user);
      setOrders(ordersRes.data.orders);
      setStats({
        totalOrders: ordersRes.data.pagination.total,
        activeRentals: ordersRes.data.orders.filter(o => 
          ['confirmed', 'shipped', 'delivered'].includes(o.orderStatus)
        ).length
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode
        }
      };
      
      const res = await api.put('/auth/profile', updateData);
      updateUser(res.data.user);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  if (!user) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <User className="w-8 h-8" />
                </div>
                <h2 className="font-bold text-xl">{user.name}</h2>
                <p className="text-primary-100 text-sm">{user.email}</p>
              </div>
              
              <nav className="p-4">
                <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-primary-50 text-primary-700 rounded-lg font-medium">
                  <User className="w-5 h-5" /> Profile
                </Link>
                <Link to="/orders" className="flex items-center gap-3 px-4 py-3 text-secondary-700 hover:bg-secondary-50 rounded-lg">
                  <Package className="w-5 h-5" /> My Orders
                </Link>
                <Link to="/wishlist" className="flex items-center gap-3 px-4 py-3 text-secondary-700 hover:bg-secondary-50 rounded-lg">
                  <Heart className="w-5 h-5" /> Wishlist
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg mt-4"
                >
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-secondary-500 text-sm">Total Orders</p>
                    <p className="text-2xl font-bold">{stats.totalOrders}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-secondary-500 text-sm">Active Rentals</p>
                    <p className="text-2xl font-bold">{stats.activeRentals}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Heart className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-secondary-500 text-sm">Wishlist Items</p>
                    <p className="text-2xl font-bold">{user.wishlist?.length || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Section */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-secondary-100 flex items-center justify-between">
                <h2 className="text-xl font-bold">Profile Information</h2>
                <button
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  disabled={isLoading}
                  className="btn-outline py-2 px-4 text-sm"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isEditing ? (
                    <>
                      <Check className="w-4 h-4 mr-2" /> Save
                    </>
                  ) : (
                    <>
                      <Edit2 className="w-4 h-4 mr-2" /> Edit
                    </>
                  )}
                </button>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-500 mb-1">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="input"
                      />
                    ) : (
                      <p className="font-medium">{user.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-500 mb-1">Email</label>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-500 mb-1">Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="input"
                      />
                    ) : (
                      <p className="font-medium">{user.phone || 'Not provided'}</p>
                    )}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-secondary-500 mb-1">Address</label>
                    {isEditing ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="street"
                          value={formData.street}
                          onChange={handleChange}
                          placeholder="Street"
                          className="input"
                        />
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="City"
                          className="input"
                        />
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          placeholder="State"
                          className="input"
                        />
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          placeholder="PIN Code"
                          className="input"
                        />
                      </div>
                    ) : (
                      <p className="font-medium">
                        {user.address?.street ? (
                          <>
                            {user.address.street}, {user.address.city}, {user.address.state} - {user.address.zipCode}
                          </>
                        ) : (
                          'No address provided'
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            {orders.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-secondary-100 flex items-center justify-between">
                  <h2 className="text-xl font-bold">Recent Orders</h2>
                  <Link to="/orders" className="text-primary-600 hover:text-primary-700 flex items-center gap-1">
                    View All <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
                
                <div className="divide-y divide-secondary-100">
                  {orders.map(order => (
                    <div key={order._id} className="p-6 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-secondary-100 rounded-lg flex items-center justify-center">
                          <Package className="w-8 h-8 text-secondary-400" />
                        </div>
                        <div>
                          <p className="font-semibold">Order #{order._id.slice(-8).toUpperCase()}</p>
                          <p className="text-sm text-secondary-500">
                            {new Date(order.createdAt).toLocaleDateString()} • {order.orderItems.length} items
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{order.totalAmount}</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                          order.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-primary-100 text-primary-700'
                        }`}>
                          {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

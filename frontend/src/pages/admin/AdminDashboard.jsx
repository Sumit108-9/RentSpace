import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  DollarSign, 
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import api from '../../utils/api';
import useStore from '../../store/useStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useStore();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0,
    recentOrders: [],
    orderGrowth: 0,
    revenueGrowth: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      toast.error('Access denied');
      return;
    }
    fetchDashboardStats();
  }, [user, navigate]);

  const fetchDashboardStats = async () => {
    try {
      const [orderStatsRes, productsRes, usersRes, recentOrdersRes] = await Promise.all([
        api.get('/orders/stats'),
        api.get('/products?limit=1'),
        api.get('/users?limit=1'),
        api.get('/orders?limit=5')
      ]);

      setStats({
        totalOrders: orderStatsRes.data.stats.totalOrders,
        totalRevenue: orderStatsRes.data.stats.totalRevenue,
        totalProducts: productsRes.data.pagination.total,
        totalUsers: usersRes.data.pagination.total,
        recentOrders: recentOrdersRes.data.orders,
        orderGrowth: 12,
        revenueGrowth: 8
      });
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin', active: true },
    { icon: Package, label: 'Products', path: '/admin/products' },
    { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
    { icon: Users, label: 'Users', path: '/admin/users' },
  ];

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-secondary-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-secondary-900 text-white flex-shrink-0 hidden lg:block">
        <div className="p-6">
          <Link to="/" className="text-2xl font-bold">RentSpace</Link>
          <p className="text-secondary-400 text-sm">Admin Panel</p>
        </div>
        <nav className="px-4 pb-4">
          {sidebarItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                item.active 
                  ? 'bg-primary-600 text-white' 
                  : 'text-secondary-300 hover:bg-secondary-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Link to="/" className="text-secondary-600 hover:text-secondary-900">
            Back to Site
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Revenue"
            value={`₹${(stats.totalRevenue || 0).toLocaleString()}`}
            icon={DollarSign}
            trend={stats.revenueGrowth}
            color="green"
          />
          <StatCard 
            title="Total Orders"
            value={stats.totalOrders}
            icon={ShoppingCart}
            trend={stats.orderGrowth}
            color="blue"
          />
          <StatCard 
            title="Total Products"
            value={stats.totalProducts}
            icon={Package}
            trend={0}
            color="purple"
          />
          <StatCard 
            title="Total Users"
            value={stats.totalUsers}
            icon={Users}
            trend={5}
            color="orange"
          />
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-secondary-100 flex items-center justify-between">
            <h2 className="text-xl font-bold">Recent Orders</h2>
            <Link to="/admin/orders" className="text-primary-600 hover:text-primary-700">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-secondary-500">Order ID</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-secondary-500">Customer</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-secondary-500">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-secondary-500">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-secondary-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-100">
                {stats.recentOrders.map(order => (
                  <tr key={order._id} className="hover:bg-secondary-50">
                    <td className="px-6 py-4 font-medium">#{order._id.slice(-8).toUpperCase()}</td>
                    <td className="px-6 py-4">{order.contactInfo?.name || order.user?.name || 'N/A'}</td>
                    <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-medium">₹{order.totalAmount}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, trend, color }) => {
  const colors = {
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-secondary-500 text-sm mb-1">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {trend !== 0 && (
        <div className="flex items-center gap-1 mt-4">
          {trend > 0 ? (
            <ArrowUpRight className="w-4 h-4 text-green-500" />
          ) : (
            <ArrowDownRight className="w-4 h-4 text-red-500" />
          )}
          <span className={`text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {Math.abs(trend)}%
          </span>
          <span className="text-secondary-400 text-sm">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

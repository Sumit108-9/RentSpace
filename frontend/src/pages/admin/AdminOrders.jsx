import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Search,
  Truck,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import api from '../../utils/api';
import useStore from '../../store/useStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const navigate = useNavigate();
  const { user } = useStore();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      toast.error('Access denied');
      return;
    }
    fetchOrders();
  }, [user, navigate, statusFilter, page]);

  const fetchOrders = async () => {
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

  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'shipped': return <Truck className="w-5 h-5 text-blue-600" />;
      case 'cancelled': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-600" />;
      default: return <Package className="w-5 h-5 text-secondary-600" />;
    }
  };

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
          <Link to="/admin" className="flex items-center gap-3 px-4 py-3 text-secondary-300 hover:bg-secondary-800 hover:text-white rounded-lg mb-1">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link to="/admin/products" className="flex items-center gap-3 px-4 py-3 text-secondary-300 hover:bg-secondary-800 hover:text-white rounded-lg mb-1">
            <Package className="w-5 h-5" /> Products
          </Link>
          <Link to="/admin/orders" className="flex items-center gap-3 px-4 py-3 bg-primary-600 text-white rounded-lg mb-1">
            <ShoppingCart className="w-5 h-5" /> Orders
          </Link>
          <Link to="/admin/users" className="flex items-center gap-3 px-4 py-3 text-secondary-300 hover:bg-secondary-800 hover:text-white rounded-lg mb-1">
            <Users className="w-5 h-5" /> Users
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">Orders</h1>

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

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-secondary-500">Order ID</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-secondary-500">Customer</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-secondary-500">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-secondary-500">Items</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-secondary-500">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-secondary-500">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-secondary-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-100">
                {orders.map(order => (
                  <tr key={order._id} className="hover:bg-secondary-50">
                    <td className="px-6 py-4 font-medium">#{order._id.slice(-8).toUpperCase()}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{order.contactInfo?.name || order.user?.name || 'N/A'}</p>
                        <p className="text-sm text-secondary-500">{order.contactInfo?.email || order.user?.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{order.orderItems.length} items</td>
                    <td className="px-6 py-4 font-medium">₹{order.totalAmount}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.orderStatus)}
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                          order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-700' :
                          order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.orderStatus}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className="border border-secondary-200 rounded-lg px-3 py-1 text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 p-6 border-t border-secondary-100">
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
      </main>
    </div>
  );
};

export default AdminOrders;

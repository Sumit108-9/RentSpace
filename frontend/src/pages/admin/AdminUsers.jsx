import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Search,
  Mail,
  Phone,
  Shield
} from 'lucide-react';
import api from '../../utils/api';
import useStore from '../../store/useStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const navigate = useNavigate();
  const { user } = useStore();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      toast.error('Access denied');
      return;
    }
    fetchUsers();
  }, [user, navigate, page]);

  const fetchUsers = async () => {
    try {
      const res = await api.get(`/users?page=${page}&limit=10`);
      setUsers(res.data.users);
      setPagination(res.data.pagination);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRole = async (userId, currentRole) => {
    try {
      const newRole = currentRole === 'admin' ? 'user' : 'admin';
      await api.put(`/users/${userId}`, { role: newRole });
      toast.success(`User role updated to ${newRole}`);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <Link to="/admin/orders" className="flex items-center gap-3 px-4 py-3 text-secondary-300 hover:bg-secondary-800 hover:text-white rounded-lg mb-1">
            <ShoppingCart className="w-5 h-5" /> Orders
          </Link>
          <Link to="/admin/users" className="flex items-center gap-3 px-4 py-3 bg-primary-600 text-white rounded-lg mb-1">
            <Users className="w-5 h-5" /> Users
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">Users</h1>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-secondary-100">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-secondary-500">User</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-secondary-500">Contact</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-secondary-500">Joined</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-secondary-500">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-secondary-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-100">
                {filteredUsers.map(u => (
                  <tr key={u._id} className="hover:bg-secondary-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="font-semibold text-primary-600">
                            {u.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{u.name}</p>
                          <p className="text-sm text-secondary-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        {u.phone && <p className="flex items-center gap-1"><Phone className="w-4 h-4" /> {u.phone}</p>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-secondary-100 text-secondary-700'
                      }`}>
                        <Shield className="w-3 h-3" />
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {u._id !== user._id && (
                        <button
                          onClick={() => toggleRole(u._id, u.role)}
                          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                          {u.role === 'admin' ? 'Make User' : 'Make Admin'}
                        </button>
                      )}
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

export default AdminUsers;

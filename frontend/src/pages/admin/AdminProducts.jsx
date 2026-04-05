import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Plus, 
  Search, 
  Edit2, 
  Trash2,
  X
} from 'lucide-react';
import api from '../../utils/api';
import useStore from '../../store/useStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const AdminProducts = () => {
  const navigate = useNavigate();
  const { user } = useStore();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'sofa',
    monthlyRent: '',
    securityDeposit: '',
    originalPrice: '',
    countInStock: '',
    images: [''],
    features: [''],
    isFeatured: false,
    isActive: true
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      toast.error('Access denied');
      return;
    }
    fetchProducts();
  }, [user, navigate]);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products?limit=100');
      setProducts(res.data.products);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        monthlyRent: Number(formData.monthlyRent),
        securityDeposit: Number(formData.securityDeposit),
        originalPrice: Number(formData.originalPrice),
        countInStock: Number(formData.countInStock),
        images: formData.images.filter(img => img.trim()),
        features: formData.features.filter(f => f.trim())
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, data);
        toast.success('Product updated');
      } else {
        await api.post('/products', data);
        toast.success('Product created');
      }
      
      setShowModal(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      monthlyRent: product.monthlyRent,
      securityDeposit: product.securityDeposit || '',
      originalPrice: product.originalPrice || '',
      countInStock: product.countInStock,
      images: product.images.length > 0 ? product.images : [''],
      features: product.features?.length > 0 ? product.features : [''],
      isFeatured: product.isFeatured,
      isActive: product.isActive
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'sofa',
      monthlyRent: '',
      securityDeposit: '',
      originalPrice: '',
      countInStock: '',
      images: [''],
      features: [''],
      isFeatured: false,
      isActive: true
    });
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
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
          <Link to="/admin/products" className="flex items-center gap-3 px-4 py-3 bg-primary-600 text-white rounded-lg mb-1">
            <Package className="w-5 h-5" /> Products
          </Link>
          <Link to="/admin/orders" className="flex items-center gap-3 px-4 py-3 text-secondary-300 hover:bg-secondary-800 hover:text-white rounded-lg mb-1">
            <ShoppingCart className="w-5 h-5" /> Orders
          </Link>
          <Link to="/admin/users" className="flex items-center gap-3 px-4 py-3 text-secondary-300 hover:bg-secondary-800 hover:text-white rounded-lg mb-1">
            <Users className="w-5 h-5" /> Users
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Products</h1>
          <button 
            onClick={() => { resetForm(); setEditingProduct(null); setShowModal(true); }}
            className="btn-primary"
          >
            <Plus className="w-5 h-5 mr-2" /> Add Product
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-secondary-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full max-w-md pl-10 pr-4 py-2 border border-secondary-200 rounded-lg"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-secondary-500">Product</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-secondary-500">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-secondary-500">Monthly Rent</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-secondary-500">Stock</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-secondary-500">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-secondary-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-100">
                {filteredProducts.map(product => (
                  <tr key={product._id} className="hover:bg-secondary-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={product.images[0]} alt="" className="w-12 h-12 object-cover rounded-lg" />
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 capitalize">{product.category}</td>
                    <td className="px-6 py-4">₹{product.monthlyRent}</td>
                    <td className="px-6 py-4">{product.countInStock}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        product.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEdit(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(product._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-secondary-100 flex items-center justify-between">
              <h2 className="text-xl font-bold">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-secondary-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="input"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="input"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="input"
                  >
                    {['sofa', 'bed', 'table', 'chair', 'wardrobe', 'decor', 'dining', 'storage'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Monthly Rent (₹)</label>
                  <input
                    type="number"
                    value={formData.monthlyRent}
                    onChange={(e) => setFormData({...formData, monthlyRent: e.target.value})}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Security Deposit (₹)</label>
                  <input
                    type="number"
                    value={formData.securityDeposit}
                    onChange={(e) => setFormData({...formData, securityDeposit: e.target.value})}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Original Price (₹)</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Stock Count</label>
                  <input
                    type="number"
                    value={formData.countInStock}
                    onChange={(e) => setFormData({...formData, countInStock: e.target.value})}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Image URL</label>
                  <input
                    type="text"
                    value={formData.images[0]}
                    onChange={(e) => setFormData({...formData, images: [e.target.value]})}
                    className="input"
                    placeholder="https://..."
                  />
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                    />
                    Featured
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    />
                    Active
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingProduct ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;

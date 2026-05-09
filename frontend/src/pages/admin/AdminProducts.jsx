import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import useStore from '../../store/useStore';

const CATEGORIES = ['sofa', 'bed', 'table', 'chair', 'wardrobe', 'decor', 'dining', 'storage'];

const EMPTY_FORM = { name: '', description: '', category: 'sofa', monthlyRent: '', securityDeposit: '', countInStock: '10', images: [], isFeatured: false, isActive: true };

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [imagePreviews, setImagePreviews] = useState([]);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');

  const getToken = () => useStore.getState().token || localStorage.getItem('token');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products', { headers: { Authorization: `Bearer ${getToken()}` } });
      const data = await res.json();
      if (data.success) {
        setProducts(data.data || []);
      } else {
        setProducts([]);
      }
    } catch (e) {
      setProducts([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const openAdd = () => { setEditingId(null); setForm(EMPTY_FORM); setImagePreviews([]); setError(''); setShowModal(true); };

  const openEdit = (p) => {
    setEditingId(p._id);
    setForm({
      name: p.name || '',
      description: p.description || '',
      category: p.category || 'sofa',
      monthlyRent: p.monthlyRent?.toString() || '',
      securityDeposit: p.securityDeposit?.toString() || '0',
      countInStock: p.countInStock?.toString() || '10',
      images: (p.images || []),
      isFeatured: p.isFeatured || false,
      isActive: p.isActive !== false
    });
    setImagePreviews(p.images || []);
    setError('');
    setShowModal(true);
  };

  const clearUserProductCache = () => {
    // Clear user product cache so they see updated data immediately
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('rentspace_cache_/api/products')) {
        localStorage.removeItem(key);
      }
    });
  };

  const handleSave = async () => {
    if (!form.name || !form.monthlyRent || !form.category) { setError('Name, rent, and category are required'); return; }
    setSaving(true); setError('');
    
    // Convert images to base64 if needed
    const processedImages = await Promise.all(form.images.map((image, idx) => {
      // If image is a File object, convert it to base64
      // Otherwise, use it as-is (already base64 string)
      if (image instanceof File) {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(image);
        });
      } else {
        return Promise.resolve(image); // Already a base64 string
      }
    }));
    
    const body = {
      name: form.name,
      description: form.description || 'No description',
      category: form.category,
      monthlyRent: Number(form.monthlyRent),
      securityDeposit: Number(form.securityDeposit) || 0,
      countInStock: Number(form.countInStock) || 10,
      images: processedImages,
      isFeatured: form.isFeatured,
      isActive: form.isActive
    };
    try {
      const url = editingId ? `/api/admin/products/${editingId}` : '/api/admin/products';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!data.success) { setError(data.message || 'Failed to save'); setSaving(false); return; }
      clearUserProductCache(); // Clear user cache for immediate sync
      setShowModal(false);
      fetchProducts();
    } catch (e) { setError('Network error'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${getToken()}` } });
      const data = await res.json();
      if (data.success) {
        clearUserProductCache(); // Clear user cache for immediate sync
        fetchProducts();
      }
    } catch (e) {}
  };

  const filtered = products.filter(p => {
    if (filterCat !== 'all' && p.category !== filterCat) return false;
    if (search && !p.name?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const inputStyle = { width: '100%', padding: '12px 14px', border: '0.5px solid #e8e6df', borderRadius: 8, fontSize: 15, fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box' };
  const labelStyle = { fontSize: 14, fontWeight: 500, color: '#888780', marginBottom: 6, display: 'block' };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 30, fontWeight: 700, color: '#2C2C2A', fontFamily: "'Playfair Display', serif" }}>Products</div>
        <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 8, fontSize: 15, fontWeight: 500, background: '#1D9E75', color: '#fff', border: 'none', cursor: 'pointer' }}>
          <Plus style={{ width: 18, height: 18 }} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, maxWidth: 300 }} />
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ ...inputStyle, maxWidth: 180 }}>
          <option value="all">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
        </select>
      </div>

      {/* Product count */}
      <div style={{ fontSize: 14, color: '#888780', marginBottom: 16 }}>{filtered.length} product{filtered.length !== 1 ? 's' : ''} found</div>

      {/* Product Grid - 4 columns */}
      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#888780', fontSize: 15 }}>Loading products...</div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#888780', fontSize: 15 }}>
          No products available. Please add products from Admin Panel.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {filtered.map(p => (
            <div key={p._id} style={{ background: '#fff', border: '0.5px solid #E8E6DF', borderRadius: 12, overflow: 'hidden' }}>
              {/* Image */}
              <div style={{ height: 160, background: '#F5F4F0', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {p.images?.[0] ? <img src={p.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 32 }}>🪑</span>}
              </div>
              {/* Content */}
              <div style={{ padding: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#2C2C2A', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                <div style={{ fontSize: 12, color: '#888780', marginBottom: 8, textTransform: 'capitalize' }}>{p.category}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: '#1D9E75' }}>₹{(p.monthlyRent || 0).toLocaleString('en-IN')}/mo</span>
                  <span style={{ fontSize: 12, color: p.countInStock > 0 ? '#2C2C2A' : '#B91C1C' }}>{p.countInStock ?? 0} in stock</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, fontWeight: 500, background: p.isActive ? '#DCFCE7' : '#FEE2E2', color: p.isActive ? '#166534' : '#B91C1C' }}>
                    {p.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => openEdit(p)} title="Edit" style={{ padding: 6, borderRadius: 6, background: '#F5F4F0', border: 'none', cursor: 'pointer' }}>
                      <Pencil style={{ width: 14, height: 14, stroke: '#1D9E75' }} />
                    </button>
                    <button onClick={() => handleDelete(p._id)} title="Delete" style={{ padding: 6, borderRadius: 6, background: '#FEE2E2', border: 'none', cursor: 'pointer' }}>
                      <Trash2 style={{ width: 14, height: 14, stroke: '#B91C1C' }} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 14, padding: 32, width: '100%', maxWidth: 540, maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer' }}>
              <X style={{ width: 20, height: 20, stroke: '#888780' }} />
            </button>
            <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 24, color: '#2C2C2A', fontFamily: "'Playfair Display', serif" }}>
              {editingId ? 'Edit Product' : 'Add New Product'}
            </div>

            {error && <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '10px 14px', borderRadius: 8, fontSize: 14, marginBottom: 16 }}>{error}</div>}

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Product Name *</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} placeholder="e.g. 3 Seater Sofa" />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Product description..." />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Category *</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inputStyle}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Monthly Rent (₹) *</label>
                <input type="number" value={form.monthlyRent} onChange={e => setForm({ ...form, monthlyRent: e.target.value })} style={inputStyle} placeholder="1299" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Security Deposit (₹)</label>
                <input type="number" value={form.securityDeposit} onChange={e => setForm({ ...form, securityDeposit: e.target.value })} style={inputStyle} placeholder="0" />
              </div>
              <div>
                <label style={labelStyle}>Stock Count</label>
                <input type="number" value={form.countInStock} onChange={e => setForm({ ...form, countInStock: e.target.value })} style={inputStyle} placeholder="10" />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Product Images</label>
              <div
                style={{
                  border: '2px dashed #E8E6DF',
                  borderRadius: 8,
                  padding: 24,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  background: '#FAFAF8'
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.style.borderColor = '#1D9E75';
                  e.currentTarget.style.background = '#F0F9F4';
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.currentTarget.style.borderColor = '#E8E6DF';
                  e.currentTarget.style.background = '#FAFAF8';
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.style.borderColor = '#E8E6DF';
                  e.currentTarget.style.background = '#FAFAF8';
                  
                  const files = Array.from(e.dataTransfer.files);
                  const imageFiles = files.filter(file => file.type.startsWith('image/'));
                  
                  if (imageFiles.length === 0) {
                    setError('Please drop only image files');
                    return;
                  }
                  
                  // Store File objects and create preview URLs
                  const previewUrls = imageFiles.map(file => URL.createObjectURL(file));
                  setForm({ ...form, images: [...form.images, ...imageFiles] });
                  setImagePreviews([...imagePreviews, ...previewUrls]);
                }}
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.multiple = true;
                  input.accept = 'image/*';
                  input.onchange = (e) => {
                  const files = Array.from(e.target.files);
                  const previewUrls = files.map(file => URL.createObjectURL(file));
                  setForm({ ...form, images: [...form.images, ...files] });
                  setImagePreviews([...imagePreviews, ...previewUrls]);
                  };
                  input.click();
                }}
              >
                {form.images.length === 0 ? (
                  <div>
                    <div style={{ fontSize: 48, marginBottom: 8 }}>📸</div>
                    <div style={{ fontSize: 14, color: '#888780', marginBottom: 8 }}>
                      Drag & drop images here or click to browse
                    </div>
                    <div style={{ fontSize: 12, color: '#888780' }}>
                      Supports: JPG, PNG, GIF, WebP
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: 14, color: '#2C2C2A', marginBottom: 12 }}>
                      {form.images.length} image{form.images.length !== 1 ? 's' : ''} selected
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                      {imagePreviews.map((img, idx) => (
                        <div key={idx} style={{ position: 'relative', paddingBottom: '100%' }}>
                          <img
                            src={img}
                            alt={`Preview ${idx + 1}`}
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              borderRadius: 4,
                              border: '1px solid #E8E6DF'
                            }}
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const newImages = form.images.filter((_, i) => i !== idx);
                              const newPreviews = imagePreviews.filter((_, i) => i !== idx);
                              setForm({ ...form, images: newImages });
                              setImagePreviews(newPreviews);
                            }}
                            style={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              background: '#B91C1C',
                              color: 'white',
                              border: 'none',
                              borderRadius: '50%',
                              width: 24,
                              height: 24,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <X style={{ width: 14, height: 14 }} />
                          </button>
                        </div>
                      ))}
                      {form.images.length < 6 && (
                        <div
                          style={{
                            border: '1px dashed #E8E6DF',
                            borderRadius: 4,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            background: '#FAFAF8'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.multiple = true;
                            input.accept = 'image/*';
                            input.onchange = async (e) => {
                              const files = Array.from(e.target.files);
                              const previewUrls = files.map(file => URL.createObjectURL(file));
                              const base64Images = await Promise.all(files.map(file => {
                                return new Promise(resolve => {
                                  const reader = new FileReader();
                                  reader.onload = () => resolve(reader.result);
                                  reader.readAsDataURL(file);
                                });
                              }));
                              const newImages = [...form.images, ...base64Images];
                              const newPreviews = [...imagePreviews, ...previewUrls];
                              setForm({ ...form, images: newImages });
                              setImagePreviews(newPreviews);
                            };
                            input.click();
                          }}
                        >
                          <div style={{ fontSize: 24 }}>+</div>
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: '#888780', marginTop: 8 }}>
                      Click to add more images (max 6)
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 20, marginBottom: 24 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#2C2C2A', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} /> Featured
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#2C2C2A', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} /> Active
              </label>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(false)} style={{ padding: '12px 24px', borderRadius: 8, fontSize: 15, fontWeight: 500, background: '#F5F4F0', color: '#2C2C2A', border: 'none', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} style={{ padding: '12px 28px', borderRadius: 8, fontSize: 15, fontWeight: 500, background: '#1D9E75', color: '#fff', border: 'none', cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;

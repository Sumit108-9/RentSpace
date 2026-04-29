import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Heart, Search, Filter } from 'lucide-react';
import useStore from '../store/useStore';

const Products = () => {
  const [searchParams] = useSearchParams();
  const [filterOpen, setFilterOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    priceRange: 5000,
  });

  // Zustand store
  const {
    products,
    productPagination,
    productFilters,
    productsLoading,
    setProductFilters,
    fetchProducts,
  } = useStore((state) => ({
    products: state.products,
    productPagination: state.productPagination,
    productFilters: state.productFilters,
    productsLoading: state.productsLoading,
    setProductFilters: state.setProductFilters,
    fetchProducts: state.fetchProducts,
  }));

  const userCart = useStore((s) => s.getUserCart());
  const userWishlist = useStore((s) => s.getUserWishlist());
  const addToCart = useStore((s) => s.addToCart);
  const updateCartItemQuantity = useStore((s) => s.updateCartItemQuantity);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const addToWishlist = useStore((s) => s.addToWishlist);
  const removeFromWishlist = useStore((s) => s.removeFromWishlist);

  // Sync URL category with store filters
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category') || '';
    if (categoryFromUrl !== productFilters.category) {
      setProductFilters({ category: categoryFromUrl });
    }
  }, [searchParams]);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts(productPagination.page, productPagination.limit);
  }, [productFilters, productPagination.page]);

  const cartItems = userCart.reduce((acc, item) => {
    const productId = String(item.product?._id || item.product?.id || '');
    if (!productId) return acc;
    acc[productId] = (acc[productId] || 0) + (item.quantity || 0);
    return acc;
  }, {});

  const handleCategoryChange = (slug) => {
    const newCategory = productFilters.category === slug ? '' : slug;
    setProductFilters({ category: newCategory });
  };

  const handleSearchChange = (value) => {
    setProductFilters({ search: value });
  };

  const handleSortChange = (value) => {
    setProductFilters({ sort: value });
  };

  const handlePriceChange = (value) => {
    setLocalFilters({ priceRange: value });
    setProductFilters({ maxPrice: value });
  };

  const handlePageChange = (newPage) => {
    fetchProducts(newPage, productPagination.limit);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateQuantity = (productId, delta) => {
    const normalizedProductId = String(productId);
    const existingItem = userCart.find((item) => {
      const itemProductId = String(item.product?._id || item.product?.id);
      return itemProductId === normalizedProductId && item.rentalDuration === 1;
    });

    if (existingItem) {
      const newQty = (existingItem.quantity || 0) + delta;
      if (newQty <= 0) {
        removeFromCart(normalizedProductId, 1);
      } else {
        updateCartItemQuantity(normalizedProductId, 1, newQty);
      }
    } else if (delta > 0) {
      const product = products.find((p) => String(p._id || p.id) === normalizedProductId);
      if (product) addToCart({ ...product, monthlyRent: product.monthlyRent ?? product.rentPrice }, 1, delta);
    }
  };


  const categories = [
    { label: 'Sofas', slug: 'sofa' },
    { label: 'Beds', slug: 'bed' },
    { label: 'Tables', slug: 'table' },
    { label: 'Chairs', slug: 'chair' },
    { label: 'Storage', slug: 'storage' },
    { label: 'Dining', slug: 'dining' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: filterOpen ? '220px 1fr' : '1fr', gap: 0, minHeight: '100vh' }}>
      {/* Filters Panel */}
      {filterOpen && (
        <div style={{ background: '#fff', borderRight: '0.5px solid #E8E6DF', padding: 24, overflowY: 'auto', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <span style={{ fontWeight: 500, fontSize: 18, color: '#2C2C2A' }}>Filters</span>
            <span style={{ fontSize: 14, color: '#1D9E75', cursor: 'pointer' }} onClick={() => setProductFilters({ category: '', search: '', sort: '', maxPrice: '' })}>Clear All</span>
          </div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#888780', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>Categories</div>
            {categories.map(cat => (
              <label key={cat.slug} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', fontSize: 16, cursor: 'pointer', color: '#2C2C2A' }}>
                <input type="checkbox" checked={productFilters.category === cat.slug} onChange={() => handleCategoryChange(cat.slug)} style={{ width: 18, height: 18, accentColor: '#1D9E75' }} />
                {cat.label}
              </label>
            ))}
          </div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#888780', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>Price Range</div>
            <input type="range" min={500} max={5000} value={localFilters.priceRange} onChange={e => handlePriceChange(parseInt(e.target.value))} style={{ width: '100%', margin: '10px 0', accentColor: '#1D9E75' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#888780' }}><span>₹500</span><span>₹5,000+</span></div>
          </div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#888780', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>Sort By</div>
            <select value={productFilters.sort} onChange={e => handleSortChange(e.target.value)} style={{ width: '100%', fontSize: 16, padding: '10px 12px', border: '0.5px solid #E8E6DF', borderRadius: 8, background: '#fff', color: '#2C2C2A', fontFamily: 'DM Sans, sans-serif', cursor: 'pointer' }}>
              <option value="">Popularity</option>
              <option value="price_low">Price ↑</option>
              <option value="price_high">Price ↓</option>
              <option value="rating">Rating</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{ overflowY: 'auto', padding: '32px 64px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button onClick={() => setFilterOpen(!filterOpen)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 8, fontSize: 16, fontWeight: 500, background: filterOpen ? '#1D9E75' : 'transparent', color: filterOpen ? 'white' : '#2C2C2A', border: '0.5px solid #E8E6DF', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s' }}>
              <Filter style={{ width: 20, height: 20 }} />
              Filters
            </button>
            <div>
              <div style={{ fontSize: 28, fontWeight: 500, color: '#2C2C2A', fontFamily: "'Playfair Display', serif" }}>{productFilters.category ? categories.find(c => c.slug === productFilters.category)?.label || 'All Furniture' : 'All Furniture'}</div>
              <div style={{ fontSize: 16, color: '#888780', marginTop: 4 }}>{productPagination.total} Products Found</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', background: '#F5F4F0', border: '0.5px solid #E8E6DF', borderRadius: 10, padding: '0 16px', gap: 12, flex: 1, maxWidth: 400 }}>
            <Search style={{ width: 20, height: 20, stroke: '#888780' }} />
            <input placeholder="Search for furniture..." value={productFilters.search} onChange={e => handleSearchChange(e.target.value)} style={{ border: 'none', background: 'transparent', fontSize: 16, padding: '10px 0', outline: 'none', flex: 1, fontFamily: 'DM Sans, sans-serif', color: '#2C2C2A' }} />
          </div>
        </div>

        {productsLoading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#888780', fontSize: 18 }}>Loading...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28 }}>
            {products.map((product, idx) => (
              <Link to={`/products/${product._id || product.id}`} key={product._id || product.id || idx} style={{ textDecoration: 'none' }}>
                <div onMouseEnter={e => { e.currentTarget.style.borderColor = '#1D9E75'; e.currentTarget.style.transform = 'translateY(-6px)'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8E6DF'; e.currentTarget.style.transform = 'translateY(0)'; }} style={{ background: '#fff', border: '0.5px solid #E8E6DF', borderRadius: 16, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.15s' }}>
                  <div style={{ height: 260, background: '#F5F4F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, position: 'relative' }}>
                    {product.images?.[0] ? <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (product.category === 'bed' ? '🛏' : product.category === 'table' ? '🍽' : product.category === 'chair' ? '🪑' : product.category === 'storage' ? '🗄️' : '🛋️')}
                    <div 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const isInWishlist = userWishlist.some(w => String(w._id || w.id) === String(product._id || product.id));
                        if (isInWishlist) {
                          removeFromWishlist(product._id || product.id);
                        } else {
                          addToWishlist(product);
                        }
                      }}
                      style={{ position: 'absolute', top: 16, right: 16, width: 44, height: 44, background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '0.5px solid #E8E6DF', cursor: 'pointer', transition: 'all 0.2s' }}>
                      {(() => {
                        const isInWishlist = userWishlist.some(w => String(w._id || w.id) === String(product._id || product.id));
                        return <Heart style={{ width: 22, height: 22, stroke: isInWishlist ? '#C4575A' : '#888780', fill: isInWishlist ? '#C4575A' : 'none' }} />;
                      })()}
                    </div>
                  </div>
                  <div style={{ padding: 16 }}>
                    <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 6, color: '#1A1A1A', lineHeight: 1.3 }}>{product.name}</div>
                    <div style={{ color: '#085041', fontWeight: 700, fontSize: 24, marginBottom: 4 }}>₹{product.monthlyRent ?? product.rentPrice}<span style={{ color: '#666', fontWeight: 400, fontSize: 14 }}>/month</span></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#888', marginTop: 6 }}>
                      <span style={{ color: '#F5A623' }}>★</span> <span style={{ fontWeight: 500, color: '#2C2C2A' }}>{product.rating || 4.5}</span> <span>({product.rentCount || product.numReviews || 24})</span>
                    </div>
                    <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                      {cartItems[String(product._id || product.id)] > 0 ? (
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', border: '0.5px solid #E8E6DF', borderRadius: 8, padding: '0 4px' }}>
                          <button onClick={(e) => { e.preventDefault(); updateQuantity(product._id || product.id, -1); }} style={{ flex: 1, fontSize: 18, padding: '8px 12px', borderRadius: 6, fontWeight: 500, background: 'transparent', color: '#2C2C2A', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s' }}>-</button>
                          <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color: '#2C2C2A', textAlign: 'center' }}>{cartItems[String(product._id || product.id)]}</span>
                          <button onClick={(e) => { e.preventDefault(); updateQuantity(product._id || product.id, 1); }} style={{ flex: 1, fontSize: 18, padding: '8px 12px', borderRadius: 6, fontWeight: 500, background: 'transparent', color: '#2C2C2A', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s' }}>+</button>
                        </div>
                      ) : (
                        <button onClick={(e) => { e.preventDefault(); addToCart({ ...product, monthlyRent: product.monthlyRent ?? product.rentPrice }, 1, 1); }} style={{ flex: 1, fontSize: 14, padding: '10px 14px', borderRadius: 8, fontWeight: 600, background: 'transparent', color: '#2C2C2A', border: '0.5px solid #E8E6DF', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s' }}>Add to Cart</button>
                      )}
                      <button onClick={(e) => { e.preventDefault(); window.location.href = `/products/${product._id || product.id}`; }} style={{ flex: 1, fontSize: 14, padding: '10px 14px', borderRadius: 8, fontWeight: 600, background: '#1D9E75', color: 'white', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s' }}>Rent Now</button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {productPagination.pages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 40 }}>
            <button
              onClick={() => handlePageChange(productPagination.page - 1)}
              disabled={productPagination.page <= 1}
              style={{
                padding: '10px 20px',
                borderRadius: 8,
                border: '0.5px solid #E8E6DF',
                background: productPagination.page <= 1 ? '#F5F4F0' : '#fff',
                color: productPagination.page <= 1 ? '#888780' : '#2C2C2A',
                cursor: productPagination.page <= 1 ? 'not-allowed' : 'pointer',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 14,
              }}
            >
              Previous
            </button>
            <span style={{ fontSize: 14, color: '#888780' }}>
              Page {productPagination.page} of {productPagination.pages}
            </span>
            <button
              onClick={() => handlePageChange(productPagination.page + 1)}
              disabled={!productPagination.hasMore}
              style={{
                padding: '10px 20px',
                borderRadius: 8,
                border: '0.5px solid #E8E6DF',
                background: !productPagination.hasMore ? '#F5F4F0' : '#fff',
                color: !productPagination.hasMore ? '#888780' : '#2C2C2A',
                cursor: !productPagination.hasMore ? 'not-allowed' : 'pointer',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 14,
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;

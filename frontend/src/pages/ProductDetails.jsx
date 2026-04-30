import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Heart, Check, RotateCcw, Shield, Truck } from 'lucide-react';
import useStore from '../store/useStore';
import { ToastContext } from '../App';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useContext(ToastContext);

  const user = useStore((s) => s.user);
  const addToCartStore = useStore((s) => s.addToCart);
  const addToWishlist = useStore((s) => s.addToWishlist);
  const removeFromWishlist = useStore((s) => s.removeFromWishlist);
  const getUserWishlist = useStore((s) => s.getUserWishlist);
  const getUserCart = useStore((s) => s.getUserCart);

  // Product from Zustand store
  const {
    selectedProduct: product,
    productsLoading: loading,
    productError: error,
    fetchProductById,
    clearSelectedProduct,
  } = useStore((state) => ({
    selectedProduct: state.selectedProduct,
    productsLoading: state.productsLoading,
    productError: state.productError,
    fetchProductById: state.fetchProductById,
    clearSelectedProduct: state.clearSelectedProduct,
  }));

  const [selectedMonths, setSelectedMonths] = useState(1);
  const [quantity, setQuantity] = useState(1);

  const baseRent = product?.monthlyRent ?? product?.rentPrice ?? 0;

  const getMonthlyPrice = (months) => {
    if (months >= 18) return Math.round(baseRent * 0.75);
    if (months >= 12) return Math.round(baseRent * 0.8);
    if (months >= 6) return Math.round(baseRent * 0.9);
    if (months >= 3) return Math.round(baseRent * 0.95);
    return Math.round(baseRent * 1.0);
  };

  const monthlyPrice = getMonthlyPrice(selectedMonths);
  const totalPrice = monthlyPrice * selectedMonths;

  const handleMonthChange = (val) => {
    const n = Math.max(1, Math.min(24, val));
    setSelectedMonths(n);
  };

  useEffect(() => {
    if (id) {
      fetchProductById(id);
    }
    return () => {
      clearSelectedProduct();
    };
  }, [id, fetchProductById, clearSelectedProduct]);

  const isInWishlist = (() => {
    if (!user || !product) return false;
    const wl = getUserWishlist();
    return wl.some((w) => String(w._id || w.id) === String(product._id || product.id));
  })();

  const isInCart = (() => {
    if (!user || !product) return false;
    const cart = getUserCart();
    return cart.some((item) => String(item._id || item.id) === String(product._id || product.id));
  })();

  const [showQuantity, setShowQuantity] = useState(false);

  const handleAddToCart = async () => {
    if (!user) {
      toast?.info('Please sign in to add items to cart');
      navigate('/login');
      return;
    }
    if (!product) return;
    
    // Add to local store
    addToCartStore(product, selectedMonths, quantity);
    
    // Sync to backend
    try {
      await api.post('/cart/add', {
        productId: product._id || product.id,
        quantity: quantity,
        duration: selectedMonths,
        rentalDuration: selectedMonths
      });
    } catch (err) {
      console.error('Failed to sync cart:', err);
      // Silent fail - local cart still works
    }
    
    toast?.success(`${product.name} added to cart`);
    setShowQuantity(true);
  };

  const handleRentNow = async () => {
    if (!user) {
      toast?.info('Please sign in to rent');
      navigate('/login');
      return;
    }
    if (!product) return;
    
    // Add to local store
    addToCartStore(product, selectedMonths, quantity);
    
    // Sync to backend
    try {
      await api.post('/cart/add', {
        productId: product._id || product.id,
        quantity: quantity,
        duration: selectedMonths,
        rentalDuration: selectedMonths
      });
    } catch (err) {
      console.error('Failed to sync cart:', err);
      // Silent fail - local cart still works
    }
    
    navigate('/checkout');
  };

  const toggleWishlist = () => {
    if (!user) {
      toast?.info('Please sign in to use wishlist');
      navigate('/login');
      return;
    }
    if (!product) return;
    const pid = product._id || product.id;
    if (isInWishlist) {
      removeFromWishlist(pid);
      toast?.info('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast?.success('Added to wishlist');
    }
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#888780' }}>Loading...</div>;
  if (error || !product) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>😕</div>
        <div style={{ color: '#B91C1C', fontSize: 14, marginBottom: 12 }}>{error || 'Product not found'}</div>
        <Link to="/products" style={{ color: '#1D9E75', textDecoration: 'none', fontSize: 13 }}>← Back to products</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '16px 80px 40px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 40 }}>
        {/* Left - Images */}
        <div>
          {/* Main Image */}
          <div style={{ width: '100%', height: 500, background: '#F5F4F0', borderRadius: 12, overflow: 'hidden', marginBottom: 20, border: '0.5px solid #E8E6DF' }}>
            {product.images?.[0] ? 
              <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : 
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64 }}>
                {product.category === 'bed' ? '🛏' : product.category === 'table' ? '🍽' : product.category === 'chair' ? '🪑' : '🛋'}
              </div>
            }
          </div>
          
          {/* Thumbnails */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ width: 70, height: 70, background: '#F5F4F0', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: i === 0 ? '2px solid #1D9E75' : '0.5px solid #E8E6DF', fontSize: 24 }}>
                {product.images?.[i] ? 
                  <img src={product.images[i]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 6 }} /> :
                  (product.category === 'bed' ? '🛏' : product.category === 'table' ? '🍽' : product.category === 'chair' ? '🪑' : '🛋')
                }
              </div>
            ))}
          </div>

          {/* Product Details Box */}
          <div style={{ background: '#F8F8F6', borderRadius: 12, padding: 20, border: '0.5px solid #E8E6DF' }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10, color: '#2C2C2A' }}>Product Details</div>
            <p style={{ fontSize: 13, color: '#666', lineHeight: 1.6, marginBottom: 12 }}>
              {product.description || 'High quality furniture with premium materials and craftsmanship.'}
            </p>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6, color: '#2C2C2A' }}>Dimensions</div>
            <div style={{ fontSize: 13, color: '#666' }}>
              {product.dimensions && typeof product.dimensions === 'object' 
                ? `W ${product.dimensions.width || 210}cm · D ${product.dimensions.length || 85}cm · H ${product.dimensions.height || 85}cm`
                : product.dimensions || 'W 210cm · D 85cm · H 85cm'
              }
            </div>
          </div>
        </div>

        {/* Right - Info */}
        <div>
          {/* Category Tag */}
          <div style={{ display: 'inline-block', padding: '6px 14px', background: '#E1F5EE', borderRadius: 4, fontSize: 12, fontWeight: 600, color: '#1D9E75', textTransform: 'uppercase', marginBottom: 12, letterSpacing: 0.5 }}>
            {product.category}
          </div>
          
          {/* Title */}
          <h1 style={{ fontSize: 32, fontWeight: 600, fontFamily: "'Playfair Display', serif", marginBottom: 12, color: '#1A1A1A', lineHeight: 1.2 }}>
            {product.name}
          </h1>
          
          {/* Price */}
          <div style={{ fontSize: 36, fontWeight: 700, color: '#085041', marginBottom: 4 }}>
            ₹{monthlyPrice}<span style={{ fontSize: 16, color: '#888780', fontWeight: 400 }}> / month</span>
          </div>
          <div style={{ fontSize: 13, color: '#666', marginBottom: 12 }}>
            ₹{monthlyPrice}/mo × {selectedMonths} {selectedMonths === 1 ? 'month' : 'months'} = <span style={{ fontWeight: 600, color: '#085041' }}>₹{totalPrice.toLocaleString('en-IN')} total</span>
          </div>
          
          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#666', marginBottom: 16 }}>
            <span style={{ color: '#F59E0B', fontSize: 16 }}>★★★★★</span>
            <span style={{ fontWeight: 500, color: '#2C2C2A' }}>4.5</span>
            <span>(120 Reviews)</span>
          </div>

          {/* Short Description */}
          <p style={{ fontSize: 14, color: '#666', lineHeight: 1.6, marginBottom: 20 }}>
            {product.description || 'Compact bedside nightstand with drawer storage. Perfect companion for your bed.'}
          </p>

          {/* Duration Selector */}
          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 10, color: '#2C2C2A' }}>Select Duration (1–24 months)</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
            <button onClick={() => handleMonthChange(selectedMonths - 1)} disabled={selectedMonths <= 1}
              style={{ width: 40, height: 40, border: '1.5px solid #E8E6DF', borderRadius: 8, background: '#fff', cursor: selectedMonths <= 1 ? 'not-allowed' : 'pointer', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', color: selectedMonths <= 1 ? '#ccc' : '#2C2C2A', transition: 'all 0.15s' }}>−</button>
            <select value={selectedMonths} onChange={(e) => handleMonthChange(Number(e.target.value))}
              style={{ width: 120, textAlign: 'center', padding: '10px 12px', border: '1.5px solid #1D9E75', borderRadius: 8, fontSize: 15, fontWeight: 600, background: '#E1F5EE', color: '#085041', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", appearance: 'auto' }}>
              {Array.from({ length: 24 }, (_, i) => i + 1).map(m => (
                <option key={m} value={m}>{m} {m === 1 ? 'Month' : 'Months'}</option>
              ))}
            </select>
            <button onClick={() => handleMonthChange(selectedMonths + 1)} disabled={selectedMonths >= 24}
              style={{ width: 40, height: 40, border: '1.5px solid #E8E6DF', borderRadius: 8, background: '#fff', cursor: selectedMonths >= 24 ? 'not-allowed' : 'pointer', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', color: selectedMonths >= 24 ? '#ccc' : '#2C2C2A', transition: 'all 0.15s' }}>+</button>
            <div style={{ fontSize: 12, color: '#888780' }}>₹{monthlyPrice}/mo</div>
          </div>

          {/* Quick Pick Buttons */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {[1, 3, 6, 12, 24].map(m => (
              <div key={m} onClick={() => handleMonthChange(m)}
                style={{ padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                  border: `1.5px solid ${selectedMonths === m ? '#1D9E75' : '#E8E6DF'}`,
                  background: selectedMonths === m ? '#E1F5EE' : '#fff',
                  color: selectedMonths === m ? '#085041' : '#888780'
                }}>{m} {m === 1 ? 'mo' : 'mo'}
              </div>
            ))}
          </div>

          {/* Features */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#2C2C2A' }}>
              <Check style={{ width: 16, height: 16, stroke: '#1D9E75' }} />Free Delivery & Installation
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#2C2C2A' }}>
              <Check style={{ width: 16, height: 16, stroke: '#1D9E75' }} />Maintenance Included
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#2C2C2A' }}>
              <Check style={{ width: 16, height: 16, stroke: '#1D9E75' }} />Easy Returns
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#2C2C2A' }}>
              <Check style={{ width: 16, height: 16, stroke: '#1D9E75' }} />Damage Protection
            </div>
          </div>

          {/* Buttons: Add to Cart OR Quantity + Rent Now */}
          {isInCart || showQuantity ? (
            <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                  style={{ width: 44, height: 44, border: '1px solid #E8E6DF', borderRadius: 10, background: '#fff', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                <span style={{ minWidth: 30, textAlign: 'center', fontSize: 16, fontWeight: 600 }}>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} 
                  style={{ width: 44, height: 44, border: '1px solid #E8E6DF', borderRadius: 10, background: '#fff', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
              </div>
              <button onClick={handleRentNow} 
                style={{ flex: 1, padding: '14px 28px', borderRadius: 10, fontSize: 16, fontWeight: 600, background: '#063831', color: 'white', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s' }}>
                Rent Now
              </button>
              <button onClick={toggleWishlist} title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'} 
                style={{ width: 56, height: 56, borderRadius: 10, border: '1px solid ' + (isInWishlist ? '#C4575A' : '#E8E6DF'), background: isInWishlist ? '#FEE2E2' : 'transparent', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Heart style={{ width: 24, height: 24, stroke: isInWishlist ? '#C4575A' : '#888780', fill: isInWishlist ? '#C4575A' : 'none' }} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <button onClick={handleAddToCart} 
                style={{ flex: 1, padding: '14px 28px', borderRadius: 10, fontSize: 16, fontWeight: 600, background: '#1D9E75', color: 'white', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s' }}>
                Add to Cart
              </button>
              <button onClick={handleRentNow} 
                style={{ flex: 1, padding: '14px 28px', borderRadius: 10, fontSize: 16, fontWeight: 600, background: '#063831', color: 'white', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s' }}>
                Rent Now
              </button>
              <button onClick={toggleWishlist} title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'} 
                style={{ width: 56, height: 56, borderRadius: 10, border: '1px solid ' + (isInWishlist ? '#C4575A' : '#E8E6DF'), background: isInWishlist ? '#FEE2E2' : 'transparent', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Heart style={{ width: 24, height: 24, stroke: isInWishlist ? '#C4575A' : '#888780', fill: isInWishlist ? '#C4575A' : 'none' }} />
              </button>
            </div>
          )}

          {/* Seamless Delivery Guaranteed */}
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '0.5px solid #E8E6DF', marginBottom: 24 }}>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: '#2C2C2A' }}>Seamless Delivery Guaranteed</div>
            
            <div style={{ display: 'flex', gap: 12 }}>
              {/* Timeline Line */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 8, height: 8, background: '#2C2C2A', borderRadius: '50%' }}></div>
                <div style={{ width: 2, flex: 1, background: '#E8E6DF', margin: '4px 0' }}></div>
                <div style={{ width: 8, height: 8, background: '#2C2C2A', borderRadius: '50%' }}></div>
                <div style={{ width: 2, flex: 1, background: '#E8E6DF', margin: '4px 0' }}></div>
                <div style={{ width: 8, height: 8, background: '#2C2C2A', borderRadius: '50%' }}></div>
              </div>
              
              {/* Steps */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#2C2C2A', marginBottom: 4 }}>Step: 1</div>
                  <div style={{ fontSize: 13, color: '#666', lineHeight: 1.5 }}>To ensure a seamless process, kindly complete your KYC verification after placing your order</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8, cursor: 'pointer' }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: '#1D9E75' }}>Know More</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </div>
                </div>
                
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#2C2C2A', marginBottom: 4 }}>Step: 2</div>
                  <div style={{ fontSize: 13, color: '#666', lineHeight: 1.5 }}>Select your delivery date as per your convenience</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8, cursor: 'pointer' }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: '#1D9E75' }}>Know More</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </div>
                </div>
                
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#2C2C2A', marginBottom: 4 }}>Step: 3</div>
                  <div style={{ fontSize: 13, color: '#666', lineHeight: 1.5 }}>Your furniture will be delivered and assembled all set to transform your space.</div>
                </div>
              </div>
            </div>
          </div>

          {/* You May Also Like */}
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: '#2C2C2A', fontFamily: "'Playfair Display', serif" }}>You May Also Like</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { name: 'Accent Chair', price: 699, icon: '🪑' },
              { name: 'Coffee Table', price: 499, icon: '☕' },
            ].map((item, idx) => (
              <Link to="/products" key={idx} style={{ textDecoration: 'none' }}>
                <div style={{ background: '#F8F8F6', borderRadius: 12, padding: 12, cursor: 'pointer', border: '0.5px solid #E8E6DF', transition: 'all 0.15s' }}>
                  <div style={{ height: 100, background: '#E8E6DF', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, marginBottom: 12 }}>{item.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#2C2C2A', marginBottom: 4 }}>{item.name}</div>
                  <div style={{ fontSize: 13, color: '#1D9E75', fontWeight: 600 }}>₹{item.price}<span style={{ color: '#888780', fontWeight: 400 }}> / month</span></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

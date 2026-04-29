import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingCart } from 'lucide-react';
import useStore from '../store/useStore';
import { ToastContext } from '../App';

const Wishlist = () => {
  const toast = useContext(ToastContext);

  const userWishlists = useStore((s) => s.userWishlists);
  const getUserWishlist = useStore((s) => s.getUserWishlist);
  const removeFromWishlist = useStore((s) => s.removeFromWishlist);
  const addToCart = useStore((s) => s.addToCart);
  void userWishlists;

  const wishlist = getUserWishlist();

  const handleRemove = (p) => {
    removeFromWishlist(p._id || p.id);
    toast?.info(`${p.name} removed from wishlist`);
  };

  const handleAddToCart = (p) => {
    addToCart(p, 1, 1);
    toast?.success(`${p.name} added to cart`);
  };

  return (
    <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 30, fontWeight: 700, fontFamily: "'Playfair Display', serif", color: '#2C2C2A' }}>My Wishlist</div>
            <div style={{ fontSize: 15, color: '#888780', marginTop: 4 }}>{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved</div>
          </div>
        </div>

        {wishlist.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', border: '0.5px solid #E8E6DF', borderRadius: 12 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>💝</div>
            <div style={{ fontSize: 18, color: '#2C2C2A', marginBottom: 8, fontWeight: 500 }}>Your wishlist is empty</div>
            <div style={{ fontSize: 15, color: '#888780', marginBottom: 20 }}>Save items you love for later</div>
            <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', padding: '14px 28px', borderRadius: 8, fontSize: 16, fontWeight: 500, background: '#1D9E75', color: 'white', textDecoration: 'none' }}>Browse Products</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
            {wishlist.map((p) => {
              const image = p.images?.[0] || p.image;
              const rent = p.monthlyRent ?? p.rentPrice ?? 0;
              return (
                <div key={p._id || p.id} style={{ background: '#fff', border: '0.5px solid #E8E6DF', borderRadius: 12, overflow: 'hidden', transition: 'all 0.15s' }}>
                  <Link to={`/products/${p._id || p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ width: '100%', height: 200, background: '#F5F4F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, overflow: 'hidden' }}>
                      {image ? <img src={image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🛋'}
                    </div>
                    <div style={{ padding: 16 }}>
                      <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 4, color: '#2C2C2A' }}>{p.name}</div>
                      <div style={{ fontSize: 18, fontWeight: 600, color: '#085041' }}>₹{rent.toLocaleString('en-IN')}<span style={{ fontSize: 14, color: '#888780', fontWeight: 400 }}> /mo</span></div>
                    </div>
                  </Link>
                  <div style={{ display: 'flex', padding: '0 16px 16px', gap: 10 }}>
                    <button onClick={() => handleAddToCart(p)} style={{ flex: 1, padding: '12px', borderRadius: 8, fontSize: 15, fontWeight: 500, background: '#1D9E75', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      <ShoppingCart style={{ width: 16, height: 16 }} /> Add to Cart
                    </button>
                    <button onClick={() => handleRemove(p)} title="Remove" style={{ padding: '10px 14px', borderRadius: 8, background: 'transparent', border: '0.5px solid #E8E6DF', cursor: 'pointer' }}>
                      <Trash2 style={{ width: 18, height: 18, stroke: '#888780' }} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
    </div>
  );
};

export default Wishlist;

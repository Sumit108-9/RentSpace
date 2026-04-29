import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Shield } from 'lucide-react';
import useStore from '../store/useStore';
import { ToastContext } from '../App';

const Cart = () => {
  const navigate = useNavigate();
  const toast = useContext(ToastContext);

  // Subscribe to store slices
  const userCarts = useStore((s) => s.userCarts);
  const user = useStore((s) => s.user);
  const getUserCart = useStore((s) => s.getUserCart);
  const getCartTotal = useStore((s) => s.getCartTotal);
  const updateCartItemQuantity = useStore((s) => s.updateCartItemQuantity);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const updateCartItemDuration = useStore((s) => s.updateCartItemDuration);
  void userCarts; // ensure subscription

  const cart = getUserCart();
  const subtotal = getCartTotal();
  const discount = Math.round(subtotal * 0.1);
  const total = subtotal - discount;

  const updateQty = (item, delta) => {
    const productId = item.product?._id || item.product?.id;
    const newQty = Math.max(1, (item.quantity || 1) + delta);
    updateCartItemQuantity(productId, item.rentalDuration, newQty);
  };

  const removeItem = (item) => {
    const productId = item.product?._id || item.product?.id;
    removeFromCart(productId, item.rentalDuration);
    toast?.info(`${item.product?.name || 'Item'} removed from cart`);
  };

  const changeDuration = (item, newDuration) => {
    updateCartItemDuration(item.cartItemId, Number(newDuration));
  };

  if (!user) {
    return (
      <div style={{ padding: 40, textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, marginBottom: 8, color: '#2C2C2A' }}>Please sign in</h2>
        <p style={{ color: '#888780', marginBottom: 20 }}>You need to be logged in to view your cart</p>
        <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '8px 16px', borderRadius: 6, fontSize: 12, fontWeight: 500, background: '#1D9E75', color: 'white', textDecoration: 'none', border: '0.5px solid #1D9E75', transition: 'all 0.15s' }}>Sign In</Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🛒</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, marginBottom: 8, color: '#2C2C2A' }}>Your cart is empty</h2>
        <p style={{ color: '#888780', marginBottom: 20 }}>Add some furniture to get started!</p>
        <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '8px 16px', borderRadius: 6, fontSize: 12, fontWeight: 500, background: '#1D9E75', color: 'white', textDecoration: 'none', border: '0.5px solid #1D9E75', transition: 'all 0.15s' }}>Browse Products</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 48px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32, alignItems: 'start' }}>
      <div>
        <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Playfair Display', serif", marginBottom: 28, color: '#2C2C2A' }}>Cart ({cart.length} {cart.length === 1 ? 'Item' : 'Items'})</div>
        {cart.map((item) => {
          const p = item.product || {};
          const image = p.images?.[0] || p.image || '';
          const monthlyRent = p.monthlyRent ?? p.rentPrice ?? 0;
          const lineTotal = monthlyRent * item.rentalDuration * item.quantity;
          return (
            <div key={item.cartItemId} style={{ background: '#fff', border: '0.5px solid #E8E6DF', borderRadius: 12, padding: 20, display: 'flex', gap: 16, marginBottom: 16, alignItems: 'center', transition: 'all 0.15s' }}>
              <div style={{ width: 100, height: 80, background: '#F5F4F0', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, flexShrink: 0, border: '0.5px solid #E8E6DF', overflow: 'hidden' }}>
                {image ? <img src={image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🛋'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 16, marginBottom: 4, color: '#2C2C2A' }}>{p.name}</div>
                <div style={{ color: '#085041', fontWeight: 600, fontSize: 16 }}>₹{lineTotal.toLocaleString('en-IN')}</div>
                <div style={{ fontSize: 13, color: '#888780', marginTop: 6 }}>
                  <select value={item.rentalDuration} onChange={(e) => changeDuration(item, e.target.value)} style={{ border: '0.5px solid #E8E6DF', borderRadius: 8, padding: '5px 10px', fontSize: 13, background: '#fff', fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', color: '#2C2C2A' }}>
                    {[1, 3, 6, 12, 18, 24].map((m) => (
                      <option key={m} value={m}>{m} {m === 1 ? 'Month' : 'Months'}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
                  <button onClick={() => updateQty(item, -1)} style={{ width: 28, height: 28, border: '0.5px solid #E8E6DF', borderRadius: 8, background: '#fff', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.15s' }}>−</button>
                  <span style={{ fontSize: 15, fontWeight: 500, minWidth: 20, textAlign: 'center', color: '#2C2C2A' }}>{item.quantity}</span>
                  <button onClick={() => updateQty(item, 1)} style={{ width: 28, height: 28, border: '0.5px solid #E8E6DF', borderRadius: 8, background: '#fff', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.15s' }}>+</button>
                </div>
              </div>
              <button onClick={() => removeItem(item)} style={{ width: 40, height: 40, border: 'none', background: 'transparent', cursor: 'pointer', marginLeft: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }} title="Remove"><Trash2 style={{ width: 20, height: 20, stroke: '#888780' }} /></button>
            </div>
          );
        })}
          <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#1D9E75', cursor: 'pointer', marginTop: 16, textDecoration: 'none' }}>← Continue Shopping</Link>
      </div>

      <div style={{ position: 'sticky', top: 80 }}>
        <div style={{ background: '#fff', border: '0.5px solid #E8E6DF', borderRadius: 12, padding: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 20, color: '#2C2C2A' }}>Price Summary</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, padding: '10px 0', borderBottom: '0.5px solid #E8E6DF', color: '#2C2C2A' }}><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, padding: '10px 0', borderBottom: '0.5px solid #E8E6DF', color: '#2C2C2A' }}><span>Delivery & Installation</span><span style={{ color: '#1D9E75' }}>₹0</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, padding: '10px 0', borderBottom: '0.5px solid #E8E6DF', color: '#2C2C2A' }}><span>Discount</span><span style={{ color: '#C4575A' }}>−₹{discount.toLocaleString('en-IN')}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 700, padding: '14px 0 18px', borderTop: '0.5px solid #E8E6DF', marginTop: 4, color: '#2C2C2A' }}><span>Total (incl. GST)</span><span>₹{total.toLocaleString('en-IN')}</span></div>
          <div style={{ background: '#E1F5EE', borderRadius: 8, padding: '12px 14px', fontSize: 13, color: '#085041', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8, border: '0.5px solid #E1F5EE' }}>
            <Shield style={{ width: 18, height: 18, stroke: '#085041', fill: 'none', flexShrink: 0 }} />
            You saved ₹{discount} on this order!
          </div>
          <button onClick={() => navigate('/checkout')} style={{ width: '100%', padding: '16px', borderRadius: 10, fontSize: 16, fontWeight: 600, background: '#1D9E75', color: 'white', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.15s' }}>Proceed to Checkout</button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Cart;

import React, { useState, useContext } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingCart, Menu, X, User, LogOut } from 'lucide-react';
import useStore from '../../store/useStore';
import { ToastContext } from '../../App';

const Layout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const toast = useContext(ToastContext);

  // Reactive store reads
  const user = useStore((s) => s.user);
  const storeLogout = useStore((s) => s.logout);
  const getCartCount = useStore((s) => s.getCartCount);
  const userCarts = useStore((s) => s.userCarts); // subscribe to trigger re-render on cart changes
  const cartCount = getCartCount();
  // userCarts referenced to ensure subscription (zustand selectors re-run when referenced state changes)
  void userCarts;

  const handleLogout = () => {
    storeLogout();
    localStorage.removeItem('user');
    toast?.info('You have been signed out');
    navigate('/');
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#FAFAF8', fontFamily: 'DM Sans, sans-serif', color: '#2C2C2A', fontSize: 16, display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <nav style={{
        background: '#fff', borderBottom: '0.5px solid #E8E6DF', padding: '0 38px',
        height: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 1000, flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <img src="/images/user-logo.png" alt="RentSpace Logo" style={{ height: 90, width: 'auto', objectFit: 'contain' }} />
          </Link>

          {/* Location Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#2C2C2A', cursor: 'pointer', padding: '8px 16px', borderRadius: 8, border: '1px solid #E8E6DF', background: '#FAFAF8' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span>Mumbai</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#888780" strokeWidth="2">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </div>
        </div>

        <div className="nav-links-desktop" style={{ display: 'flex', gap: 40, fontSize: 18, color: '#888780' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit', transition: 'color 0.15s' }}>Home</Link>
          <Link to="/products" style={{ textDecoration: 'none', color: 'inherit', transition: 'color 0.15s' }}>Furniture</Link>
          <Link to="/categories" style={{ textDecoration: 'none', color: 'inherit', transition: 'color 0.15s' }}>Categories</Link>
          <Link to="/contact" style={{ textDecoration: 'none', color: 'inherit', transition: 'color 0.15s' }}>About Us</Link>
        </div>

        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <Link to="/products" style={{ color: '#888780' }}><Search style={{ width: 26, height: 26 }} /></Link>
          <Link to="/wishlist" style={{ color: '#888780' }}><Heart style={{ width: 26, height: 26 }} /></Link>
          <Link to="/cart" style={{ color: '#888780', position: 'relative' }}>
            <ShoppingCart style={{ width: 26, height: 26 }} />
            {cartCount > 0 && <span style={{
              position: 'absolute', top: -8, right: -8, background: '#1D9E75', color: '#fff',
              fontSize: 13, fontWeight: 600, borderRadius: '50%', width: 24, height: 24,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>{cartCount}</span>}
          </Link>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', fontSize: 17, color: '#2C2C2A' }}>
                <div style={{ width: 36, height: 36, background: '#E1F5EE', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 600, color: '#085041' }}>
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              </Link>
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888780' }}><LogOut style={{ width: 22, height: 22 }} /></button>
            </div>
          ) : (
            <Link to="/login" style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              padding: '10px 22px', borderRadius: 8, fontSize: 17, fontWeight: 500,
              background: '#1D9E75', color: 'white', textDecoration: 'none', border: 'none'
            }}>Login</Link>
          )}
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'none' }} className="mobile-menu-btn">
            {menuOpen ? <X style={{ width: 18, height: 18, color: '#888780' }} /> : <Menu style={{ width: 18, height: 18, color: '#888780' }} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && <div style={{
        background: '#fff', borderBottom: '0.5px solid #e8e6df', padding: '12px 20px',
        display: 'flex', flexDirection: 'column', gap: 12, fontSize: 12, flexShrink: 0
      }}>
        <Link to="/" onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none', color: '#2C2C2A' }}>Home</Link>
        <Link to="/products" onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none', color: '#2C2C2A' }}>Furniture</Link>
        <Link to="/categories" onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none', color: '#2C2C2A' }}>Categories</Link>
        <Link to="/contact" onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none', color: '#2C2C2A' }}>About Us</Link>
      </div>}

      <div style={{ flex: 1, minHeight: 0 }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;

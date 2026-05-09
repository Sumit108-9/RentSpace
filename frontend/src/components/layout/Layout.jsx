import React, { useState, useContext, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingCart, Menu, X, User, LogOut, MapPin, ArrowRight } from 'lucide-react';
import useStore from '../../store/useStore';
import { ToastContext } from '../../App';

const CITY_PINCODES = {
  'Mumbai': ['400001', '400004', '400013', '400020', '400028', '400050', '400057', '400064', '400071', '400080'],
  'Delhi': ['110001', '110002', '110003', '110004', '110005', '110006', '110007', '110008', '110009', '110010'],
  'Bengaluru': ['560001', '560002', '560003', '560004', '560005', '560006', '560007', '560008', '560009', '560010'],
  'Hyderabad': ['500001', '500002', '500003', '500004', '500005', '500006', '500007', '500008', '500009', '500010'],
  'Chennai': ['600001', '600002', '600003', '600004', '600005', '600006', '600007', '600008', '600009', '600010'],
  'Pune': ['411001', '411002', '411003', '411004', '411005', '411006', '411007', '411008', '411009', '411010'],
  'Kolkata': ['700001', '700002', '700003', '700004', '700005', '700006', '700007', '700008', '700009', '700010'],
  'Ahmedabad': ['380001', '380002', '380003', '380004', '380005', '380006', '380007', '380008', '380009', '380010']
};

const MAIN_CITIES = [
  { name: 'Bengaluru', icon: '🏛️' },
  { name: 'Mumbai', icon: '🏢' },
  { name: 'Hyderabad', icon: '🕌' },
  { name: 'Pune', icon: '🏰' },
  { name: 'Delhi', icon: '🏛️' },
  { name: 'Chennai', icon: '⛪' },
  { name: 'Kolkata', icon: '🌉' },
  { name: 'Ahmedabad', icon: '🏭' }
];

const Layout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [locationModal, setLocationModal] = useState(false);
  const [currentCity, setCurrentCity] = useState('Mumbai');
  const [pincode, setPincode] = useState('');
  const [savedPincode, setSavedPincode] = useState('400104');
  const navigate = useNavigate();
  const toast = useContext(ToastContext);

  useEffect(() => {
    const savedCity = localStorage.getItem('userCity');
    const savedPin = localStorage.getItem('userPincode');
    if (savedCity) setCurrentCity(savedCity);
    if (savedPin) setSavedPincode(savedPin);
  }, []);

  const handleCitySelect = (city) => {
    setCurrentCity(city);
    localStorage.setItem('userCity', city);
    // Auto-assign first pincode of the city
    const defaultPin = CITY_PINCODES[city]?.[0] || '400001';
    setSavedPincode(defaultPin);
    localStorage.setItem('userPincode', defaultPin);
    setLocationModal(false);
    toast?.success(`Location changed to ${city} (${defaultPin})`);
  };

  const handlePincodeSubmit = () => {
    if (pincode.length === 6 && /^\d{6}$/.test(pincode)) {
      setSavedPincode(pincode);
      localStorage.setItem('userPincode', pincode);
      toast?.success(`Pincode ${pincode} saved`);
      setPincode('');
    } else {
      toast?.error('Please enter a valid 6-digit pincode');
    }
  };

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
          <div 
            onClick={() => setLocationModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#2C2C2A', cursor: 'pointer', padding: '8px 16px', borderRadius: 8, border: '1px solid #E8E6DF', background: '#FAFAF8' }}
          >
            <MapPin size={16} color="#1D9E75" />
            <span>{currentCity}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#888780" strokeWidth="2">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </div>
        </div>

        <div className="nav-links-desktop" style={{ display: 'flex', gap: 40, fontSize: 18, color: '#888780' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit', transition: 'color 0.15s' }}>Home</Link>
          <Link to="/products" style={{ textDecoration: 'none', color: 'inherit', transition: 'color 0.15s' }}>Furniture</Link>
          <Link to="/categories" style={{ textDecoration: 'none', color: 'inherit', transition: 'color 0.15s' }}>Categories</Link>
          <Link to="/about" style={{ textDecoration: 'none', color: 'inherit', transition: 'color 0.15s' }}>About Us</Link>
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
        <Link to="/about" onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none', color: '#2C2C2A' }}>About Us</Link>
      </div>}

      {/* Location Modal */}
      {locationModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 2000, padding: 20
        }} onClick={() => setLocationModal(false)}>
          <div style={{
            background: '#fff', borderRadius: 16, padding: 40, maxWidth: 600, width: '100%',
            maxHeight: '90vh', overflow: 'auto', position: 'relative'
          }} onClick={e => e.stopPropagation()}>
            {/* Close Button */}
            <button 
              onClick={() => setLocationModal(false)}
              style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <X size={24} color="#888780" />
            </button>

            {/* Title */}
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 600, textAlign: 'center', marginBottom: 8, color: '#2C2C2A' }}>
              Select Delivery Location
            </h2>

            {/* Pincode Input */}
            <div style={{ marginTop: 32, marginBottom: 16 }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Enter your pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  onKeyPress={(e) => e.key === 'Enter' && handlePincodeSubmit()}
                  style={{
                    width: '100%', height: 56, padding: '0 60px 0 24px', border: '2px solid #1D9E75',
                    borderRadius: 28, fontSize: 16, fontFamily: "'DM Sans', sans-serif",
                    outline: 'none', boxSizing: 'border-box'
                  }}
                />
                <button 
                  onClick={handlePincodeSubmit}
                  style={{
                    position: 'absolute', right: 8, width: 40, height: 40,
                    background: '#1D9E75', border: 'none', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <ArrowRight size={20} color="white" />
                </button>
              </div>
            </div>

            {/* Current Pincode */}
            <p style={{ textAlign: 'center', fontSize: 14, color: '#888780', marginBottom: 32 }}>
              Currently selected pincode : <strong style={{ color: '#1D9E75' }}>{savedPincode}</strong>
            </p>

            {/* Divider with text */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ flex: 1, height: 1, background: '#E8E6DF' }}></div>
              <span style={{ padding: '0 16px', fontSize: 14, color: '#888780' }}>Or select your city</span>
              <div style={{ flex: 1, height: 1, background: '#E8E6DF' }}></div>
            </div>

            {/* Cities Grid with Pincodes */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
              {MAIN_CITIES.map(city => (
                <div
                  key={city.name}
                  onClick={() => handleCitySelect(city.name)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    padding: 16, borderRadius: 12, cursor: 'pointer',
                    background: currentCity === city.name ? '#E1F5EE' : '#FAFAF8',
                    border: currentCity === city.name ? '2px solid #1D9E75' : '2px solid transparent',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{
                    width: 60, height: 60, borderRadius: 12, background: '#D4F5E9',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 28, marginBottom: 8
                  }}>
                    {city.icon}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: currentCity === city.name ? 600 : 400, color: '#2C2C2A' }}>
                    {city.name}
                  </span>
                  <span style={{ fontSize: 11, color: '#888780', marginTop: 4 }}>
                    {CITY_PINCODES[city.name]?.[0]}
                  </span>
                </div>
              ))}
            </div>

            <p style={{ textAlign: 'center', fontSize: 12, color: '#888780' }}>
              Click any city to auto-select its default pincode
            </p>
          </div>
        </div>
      )}

      <div style={{ flex: 1, minHeight: 0 }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;

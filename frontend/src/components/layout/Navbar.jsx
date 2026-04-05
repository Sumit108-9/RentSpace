import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Package,
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Heart,
  ChevronDown,
  MapPin,
  HelpCircle,
  Store,
  Phone,
  LogOut,
  Navigation,
  Loader2,
  AlertCircle
} from 'lucide-react';
import useStore from '../../store/useStore';
import { useLocation as useDeliveryLocation, POPULAR_CITIES, OTHER_CITIES } from '../../context/LocationContext';

const Navbar = () => {
  const { user, isAuthenticated, logout, getCartCount, cart, wishlist } = useStore();
  const { location: deliveryLocation, setLocationByCity, setLocationByPincode, detectLocation, isLoading, isGeolocating, error, clearError, validatePincode } = useDeliveryLocation();
  const navigate = useNavigate();
  const location = useLocation();
  const isProductsPage = location.pathname === '/products';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null); // 'buy' | 'rent' | null
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [pincodeInput, setPincodeInput] = useState('');
  const [pincodeError, setPincodeError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  const cartCount = getCartCount();
  const wishlistCount = wishlist?.length || 0;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (activeMenu && !e.target.closest('.navbar-menu-container')) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeMenu]);

  // Prevent body scroll when location drawer is open - with cleanup
  useEffect(() => {
    if (isLocationModalOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px'; // Prevent layout shift from scrollbar
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    
    return () => {
      // Always clean up on unmount
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isLocationModalOpen]);

  // Ensure all menus close on route change
  useEffect(() => {
    const handleRouteChange = () => {
      setIsLocationModalOpen(false);
      setActiveMenu(null);
      setIsUserMenuOpen(false);
      setIsMenuOpen(false);
    };
    
    return () => handleRouteChange();
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Handle city selection from modal
  const handleCitySelect = (cityName) => {
    const success = setLocationByCity(cityName);
    if (success) {
      setIsLocationModalOpen(false);
    }
  };

  // Handle pincode submission
  const handlePincodeSubmit = async () => {
    if (pincodeInput.length !== 6) {
      setPincodeError('Please enter a valid 6-digit pincode');
      return;
    }
    
    const success = await setLocationByPincode(pincodeInput);
    if (success) {
      setIsLocationModalOpen(false);
      setPincodeInput('');
      setPincodeError('');
    }
  };

  const categories = [
    { name: 'Sofas', path: '/products?category=sofa' },
    { name: 'Beds', path: '/products?category=bed' },
    { name: 'Tables', path: '/products?category=table' },
    { name: 'Storage', path: '/products?category=storage' },
    { name: 'Dining', path: '/products?category=dining' },
  ];

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'shadow-lg bg-surface' 
          : 'bg-surface/95 backdrop-blur-sm'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20 lg:h-24">
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg">
              <Package className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-theme-primary">RentSpace</span>
          </Link>

          {/* Buy Dropdown Trigger */}
          <div className="hidden lg:flex items-center gap-12 ml-16 navbar-menu-container">
            <div className="relative">
              <button
                onClick={() => setActiveMenu(activeMenu === 'buy' ? null : 'buy')}
                onMouseEnter={() => setActiveMenu('buy')}
                className="flex items-center justify-center gap-2 h-10 px-4 min-w-[80px] text-theme-secondary hover:text-accent font-semibold text-lg transition-colors rounded-lg hover:bg-theme-secondary/50 active:bg-theme-secondary/70"
              >
                <span className="leading-none">Buy</span>
                <ChevronDown className={`w-5 h-5 shrink-0 transition-transform duration-200 ${activeMenu === 'buy' ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Mega Menu Dropdown */}
              {activeMenu === 'buy' && (
                <div 
                  className="absolute top-full left-0 mt-4 w-[600px] bg-surface rounded-2xl shadow-2xl border border-theme p-6 animate-fade-in"
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-theme-primary">Buy Furniture</h3>
                    <p className="text-sm text-theme-muted">Premium furniture at unbeatable prices</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { name: 'Bed', icon: '🛏️', badge: null },
                      { name: 'Sofa', icon: '�️', badge: null },
                      { name: 'Table', icon: '🪑', badge: null },
                      { name: 'Wardrobe', icon: '👔', badge: null },
                      { name: 'Modular Kitchen', icon: '🍳', badge: 'NEW' },
                      { name: 'TV Shelf', icon: '📺', badge: null },
                    ].map((item) => (
                      <Link
                        key={item.name}
                        to={`/products?category=${item.name.toLowerCase().replace(' ', '-')}`}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-theme-secondary transition-colors group"
                        onClick={() => setActiveMenu(null)}
                      >
                        <span className="text-2xl">{item.icon}</span>
                        <div className="flex-1">
                          <span className="font-medium text-theme-primary group-hover:text-accent">{item.name}</span>
                          {item.badge && (
                            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${item.badge === 'HOT' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {!isProductsPage && (
              <>
            {/* Rent Dropdown - Compact & Premium */}
            <div className="relative navbar-menu-container">
              <button
                onClick={() => setActiveMenu(activeMenu === 'rent' ? null : 'rent')}
                onMouseEnter={() => setActiveMenu('rent')}
                className="flex items-center justify-center gap-2 h-10 px-4 min-w-[80px] text-theme-secondary hover:text-accent font-semibold text-lg transition-colors rounded-lg hover:bg-theme-secondary/50 active:bg-theme-secondary/70"
              >
                <span className="leading-none">Rent</span>
                <ChevronDown className={`w-5 h-5 shrink-0 transition-transform duration-200 ${activeMenu === 'rent' ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Compact Rent Mega Menu */}
              {activeMenu === 'rent' && (
                <div 
                  className="absolute top-full left-0 mt-3 w-[480px] bg-surface rounded-xl shadow-xl border border-theme overflow-hidden animate-fade-in"
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  {/* Header Section */}
                  <div className="px-5 py-4 bg-gradient-to-r from-primary-50 to-primary-100/50 border-b border-theme">
                    <h3 className="text-base font-bold text-theme-primary">Rent Furniture</h3>
                    <p className="text-xs text-theme-muted mt-0.5">Flexible plans starting at ₹999/month</p>
                  </div>
                  
                  {/* Category Grid - 2 columns, compact */}
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: 'Bed', icon: '🛏️', badge: null, desc: 'Comfortable beds' },
                      { name: 'Sofa', icon: '🛋️', badge: null, desc: 'Stylish sofas' },
                      { name: 'Table', icon: '🪑', badge: null, desc: 'Dining tables' },
                      { name: 'Wardrobe', icon: '👔', badge: null, desc: 'Storage solutions' },
                      { name: 'Modular Kitchen', icon: '🍳', badge: 'NEW', desc: 'Modern kitchens' },
                      { name: 'TV Shelf', icon: '📺', badge: null, desc: 'Entertainment units' },
                    ].map((item) => (
                        <Link
                          key={item.name}
                          to={`/products?category=${item.name.toLowerCase().replace(' ', '-')}`}
                          className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-primary-50 transition-all group"
                          onClick={() => setActiveMenu(null)}
                        >
                          <span className="text-xl">{item.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-medium text-sm text-theme-primary group-hover:text-accent truncate">{item.name}</span>
                              {item.badge && (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${item.badge === 'HOT' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-theme-muted truncate">{item.desc}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                  
                  {/* Footer CTA */}
                  <div className="px-4 py-3 bg-theme-secondary/30 border-t border-theme">
                    <Link 
                      to="/products" 
                      className="flex items-center justify-center gap-2 text-sm font-medium text-accent hover:text-accent-dark transition-colors"
                      onClick={() => setActiveMenu(null)}
                    >
                      View All Rental Products
                      <ChevronDown className="w-4 h-4 -rotate-90" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link to="/customize" className="text-theme-secondary hover:text-accent font-semibold text-lg transition-colors">
              Customize
            </Link>
              </>
            )}
          </div>

          <div className={`hidden md:flex items-center gap-4 flex-1 max-w-md ${isProductsPage ? 'mx-6 lg:mx-auto' : 'mx-6 lg:mx-10'}`}>
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder="Search furniture..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input w-full rounded-full pr-12"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-theme-muted hover:text-accent"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-1 md:gap-3 flex-shrink-0">
            {/* Location Selector */}
            <button
              onClick={() => {
                setPincodeError('');
                setPincodeInput('');
                clearError();
                setIsLocationModalOpen(true);
              }}
              className="hidden md:flex items-center gap-2 px-3 py-2 text-theme-secondary hover:text-accent transition-colors"
            >
              <MapPin className="w-5 h-5" />
              <span className="text-sm font-medium hidden lg:block">{deliveryLocation?.city || 'Bengaluru'}</span>
            </button>

            {/* Wishlist */}
            <Link to="/wishlist" className="relative p-2.5 text-theme-secondary hover:text-accent transition-colors rounded-full hover:bg-theme-secondary">
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative p-2.5 text-theme-secondary hover:text-accent transition-colors rounded-full hover:bg-theme-secondary">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary-600 text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-2 text-theme-secondary hover:text-accent transition-colors"
              >
                <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-600" />
                </div>
                {isAuthenticated && (
                  <span className="hidden md:block font-medium text-theme-primary">{user?.name?.split(' ')[0]}</span>
                )}
              </button>

              {/* Enhanced User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-surface rounded-2xl shadow-2xl border border-theme py-3 animate-fade-in z-50">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-3 border-b border-theme">
                        <p className="text-sm text-theme-muted">Hello,</p>
                        <p className="font-semibold text-theme-primary text-lg">{user?.name}</p>
                      </div>
                      <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 hover:bg-theme-secondary text-theme-secondary transition-colors">
                        <User className="w-5 h-5" /> 
                        <span>My Account</span>
                      </Link>
                      <Link to="/orders" className="flex items-center gap-3 px-4 py-3 hover:bg-theme-secondary text-theme-secondary transition-colors">
                        <Package className="w-5 h-5" /> 
                        <span>My Orders</span>
                      </Link>
                      <Link to="/wishlist" className="flex items-center gap-3 px-4 py-3 hover:bg-theme-secondary text-theme-secondary transition-colors">
                        <Heart className="w-5 h-5" /> 
                        <span>My Wishlist</span>
                      </Link>
                      <button className="flex items-center gap-3 px-4 py-3 hover:bg-theme-secondary text-theme-secondary transition-colors w-full text-left">
                        <HelpCircle className="w-5 h-5" /> 
                        <span>Track Product Issue Request</span>
                      </button>
                      <Link to="/contact" className="flex items-center gap-3 px-4 py-3 hover:bg-theme-secondary text-theme-secondary transition-colors">
                        <Phone className="w-5 h-5" /> 
                        <span>Contact Us</span>
                      </Link>
                      <button className="flex items-center gap-3 px-4 py-3 hover:bg-theme-secondary text-theme-secondary transition-colors w-full text-left">
                        <Store className="w-5 h-5" /> 
                        <span>Find Store</span>
                      </button>
                      <button className="flex items-center gap-3 px-4 py-3 hover:bg-theme-secondary text-theme-secondary transition-colors w-full text-left">
                        <HelpCircle className="w-5 h-5" /> 
                        <span>Help Centre</span>
                      </button>
                      <div className="border-t border-theme mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-error w-full text-left transition-colors"
                        >
                          <LogOut className="w-5 h-5" /> 
                          <span>Logout</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-3 border-b border-theme">
                        <p className="text-sm text-theme-muted">Welcome!</p>
                        <p className="font-semibold text-theme-primary">Please sign in</p>
                      </div>
                      <Link 
                        to="/login" 
                        className="flex items-center gap-3 px-4 py-3 hover:bg-theme-secondary text-theme-secondary transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="w-5 h-5" /> 
                        <span>Login / Sign Up</span>
                      </Link>
                      <button className="flex items-center gap-3 px-4 py-3 hover:bg-theme-secondary text-theme-secondary transition-colors w-full text-left">
                        <HelpCircle className="w-5 h-5" /> 
                        <span>Track Product Issue Request</span>
                      </button>
                      <Link to="/contact" className="flex items-center gap-3 px-4 py-3 hover:bg-theme-secondary text-theme-secondary transition-colors">
                        <Phone className="w-5 h-5" /> 
                        <span>Contact Us</span>
                      </Link>
                      <button className="flex items-center gap-3 px-4 py-3 hover:bg-theme-secondary text-theme-secondary transition-colors w-full text-left">
                        <Store className="w-5 h-5" /> 
                        <span>Find Store</span>
                      </button>
                      <button className="flex items-center gap-3 px-4 py-3 hover:bg-theme-secondary text-theme-secondary transition-colors w-full text-left">
                        <HelpCircle className="w-5 h-5" /> 
                        <span>Help Centre</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2.5 text-theme-secondary hover:bg-theme-secondary rounded-full transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden bg-surface border-t border-theme animate-slide-up">
          <div className="container-custom py-4 space-y-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search furniture..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input w-full"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                <Search className="w-5 h-5 text-theme-muted" />
              </button>
            </form>
            {!isProductsPage && (
              <nav className="space-y-1">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    to={category.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-3 px-4 rounded-lg hover:bg-theme-secondary text-theme-secondary font-medium"
                  >
                    {category.name}
                  </Link>
                ))}
              </nav>
            )}
          </div>
        </div>
      )}

      {/* Location Selector - Left Side Drawer */}
      {isLocationModalOpen && (
        <div 
          className="fixed inset-0 z-50"
          style={{ pointerEvents: isLocationModalOpen ? 'auto' : 'none' }}
        >
          {/* Backdrop Overlay */}
          <div 
            className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300 ${isLocationModalOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={() => setIsLocationModalOpen(false)}
          />
          
          {/* Left Side Drawer */}
          <div className="absolute top-0 left-0 h-screen w-full sm:w-[420px] md:w-[480px] bg-surface shadow-2xl flex flex-col transform transition-transform duration-300 ease-out">
            {/* Header - Fixed */}
            <div className="flex-none px-5 sm:px-6 py-4 sm:py-5 border-b border-theme bg-gradient-to-r from-primary-50/80 to-transparent">
              <div className="flex items-center gap-3">
                <div className="p-2 sm:p-2.5 bg-primary-100 rounded-xl shadow-sm">
                  <MapPin className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-theme-primary">Select Delivery Location</h3>
                  <p className="text-xs sm:text-sm text-theme-muted">Choose your city or enter pincode</p>
                </div>
                <button 
                  onClick={() => setIsLocationModalOpen(false)}
                  className="p-1.5 sm:p-2 hover:bg-theme-secondary rounded-full transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5 text-theme-secondary" />
                </button>
              </div>
            </div>
            
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden" style={{ minHeight: '200px' }}>
              <div className="p-4 sm:p-6 space-y-6">
                {/* Pincode Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <label className="text-xs sm:text-sm font-semibold text-theme-secondary flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                      Enter Pincode
                    </label>
                    <button
                      onClick={async () => {
                        const success = await detectLocation();
                        if (success) {
                          setIsLocationModalOpen(false);
                        }
                      }}
                      disabled={isGeolocating}
                      className="text-[10px] sm:text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                    >
                      <Navigation className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      {isGeolocating ? 'Detecting...' : 'Detect my location'}
                    </button>
                  </div>
                  
                  <div className="flex gap-2 sm:gap-3">
                    <div className="relative flex-1">
                      <MapPin className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-theme-muted" />
                      <input
                        type="text"
                        placeholder="6 digit pincode"
                        value={pincodeInput}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                          setPincodeInput(value);
                          setPincodeError('');
                          clearError();
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && pincodeInput.length === 6) {
                            handlePincodeSubmit();
                          }
                        }}
                        className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3.5 bg-theme-secondary/60 border-2 ${pincodeError || error ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : 'border-theme focus:border-primary-500 focus:ring-primary-200'} rounded-xl text-theme-primary placeholder:text-theme-muted/70 focus:outline-none focus:ring-4 transition-all text-sm sm:text-base font-medium`}
                        maxLength="6"
                      />
                    </div>
                    <button 
                      onClick={handlePincodeSubmit}
                      disabled={pincodeInput.length !== 6 || isLoading}
                      className="px-4 sm:px-6 py-2.5 sm:py-3.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg flex-shrink-0 text-sm sm:text-base"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 sm:w-5 h-4 sm:h-5 animate-spin" />
                      ) : (
                        'Check'
                      )}
                    </button>
                  </div>
                  
                  {(pincodeError || error) && (
                    <div className="flex items-start gap-2 text-xs sm:text-sm text-red-600 bg-red-50 p-2.5 sm:p-3 rounded-lg">
                      <AlertCircle className="w-3.5 sm:w-4 h-3.5 sm:h-4 mt-0.5 flex-shrink-0" />
                      <span>{pincodeError || error}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-xs sm:text-sm px-1">
                    <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 bg-green-500 rounded-full animate-pulse flex-shrink-0" />
                    <span className="text-theme-muted truncate">
                      Delivering to: <span className="font-semibold text-theme-secondary">{deliveryLocation?.city} - {deliveryLocation?.pincode}</span>
                    </span>
                  </div>
                </div>
                
                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-theme to-transparent" />
                
                {/* Popular Cities */}
                <div className="space-y-4">
                  <h4 className="text-xs sm:text-sm font-semibold text-theme-secondary flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                    Popular Cities
                  </h4>
                  <div className="grid grid-cols-4 gap-2 sm:gap-3">
                    {POPULAR_CITIES.map((city) => (
                      <button
                        key={city.name}
                        onClick={() => handleCitySelect(city.name)}
                        className={`flex flex-col items-center gap-1.5 sm:gap-2 p-2 sm:p-3 rounded-xl transition-all group border ${
                          deliveryLocation?.city === city.name 
                            ? 'bg-primary-50 border-primary-300 ring-2 ring-primary-500/30' 
                            : 'bg-theme-secondary/40 border-transparent hover:bg-primary-50/50 hover:border-primary-200'
                        }`}
                      >
                        <span className="text-xl sm:text-2xl group-hover:scale-110 transition-transform duration-200">{city.icon}</span>
                        <span className={`text-[10px] sm:text-xs font-medium text-center leading-tight ${deliveryLocation?.city === city.name ? 'text-primary-700' : 'text-theme-secondary'}`}>
                          {city.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Other Cities */}
                <div className="space-y-4">
                  <h4 className="text-xs sm:text-sm font-semibold text-theme-secondary flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-secondary-400 rounded-full"></span>
                    Other Cities
                  </h4>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {OTHER_CITIES.map((city) => (
                      <button
                        key={city}
                        onClick={() => handleCitySelect(city)}
                        className={`py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-medium transition-all border ${
                          deliveryLocation?.city === city
                            ? 'bg-primary-600 text-white border-primary-600 shadow-md'
                            : 'bg-theme-secondary/40 text-theme-secondary border-transparent hover:bg-primary-50 hover:border-primary-200'
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

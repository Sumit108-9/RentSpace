import React, { Suspense, lazy, useState, useCallback, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import UserPortalLayout from './components/layout/UserPortalLayout';
import AdminLayout from './components/layout/AdminLayout';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import { ToastContainer } from './components/common/Toast';

// Create a simple toast context
export const ToastContext = React.createContext(null);

let toastId = 0;

// Lazy load all pages
const Home = lazy(() => import('./pages/Home'));
const Cart = lazy(() => import('./pages/Cart'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Customize = lazy(() => import('./pages/Customize'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Orders = lazy(() => import('./pages/Orders'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Profile = lazy(() => import('./pages/Profile'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const Contact = lazy(() => import('./pages/Contact'));
const Categories = lazy(() => import('./pages/Categories'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Wrap components with their own ErrorBoundary to catch specific page crashes
const SafeHome = () => (
  <ErrorBoundary name="Home">
    <Home />
  </ErrorBoundary>
);

const SafeCart = () => (
  <ErrorBoundary name="Cart">
    <Cart />
  </ErrorBoundary>
);

const SafeProducts = () => (
  <ErrorBoundary name="Products">
    <Products />
  </ErrorBoundary>
);

const SafeCategories = () => (
  <ErrorBoundary name="Categories">
    <Categories />
  </ErrorBoundary>
);

function App() {
  console.log('App rendering');
  
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, options = {}) => {
    const id = ++toastId;
    const newToast = {
      id,
      message,
      type: options.type || 'info',
      title: options.title,
      duration: options.duration || 2500,
      ...options
    };
    setToasts(prev => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Listen for custom toast events from anywhere in the app
  useEffect(() => {
    const handleShowToast = (e) => {
      const { message, type = 'info', title, duration } = e.detail;
      addToast(message, { type, title, duration });
    };

    window.addEventListener('showToast', handleShowToast);
    return () => window.removeEventListener('showToast', handleShowToast);
  }, [addToast]);

  const toastValue = {
    toasts,
    addToast,
    removeToast,
    success: (message, options = {}) => addToast(message, { ...options, type: 'success', title: options.title || 'Success!' }),
    error: (message, options = {}) => addToast(message, { ...options, type: 'error', title: options.title || 'Error!' }),
    warning: (message, options = {}) => addToast(message, { ...options, type: 'warning', title: options.title || 'Warning!' }),
    info: (message, options = {}) => addToast(message, { ...options, type: 'info', title: options.title || 'Info' })
  };
  
  return (
    <ToastContext.Provider value={toastValue}>
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <ToastContainer toasts={toasts} removeToast={removeToast} />
        <Routes>
          <Route element={<ProtectedRoute><UserPortalLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/wishlist" element={<Wishlist />} />
          </Route>
          {/* Admin routes — self-contained layout, no main navbar */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/users" element={<AdminUsers />} />
          </Route>

          <Route path="/" element={<Layout />}>
            <Route index element={<SafeHome />} />
            <Route path="categories" element={<SafeCategories />} />
            <Route path="products" element={<SafeProducts />} />
            <Route path="products/:id" element={<ProductDetails />} />
            <Route path="cart" element={<SafeCart />} />
            <Route path="checkout" element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="customize" element={<Customize />} />
            <Route path="contact" element={<Contact />} />
            <Route path="order-success/:orderId" element={<OrderSuccess />} />
            <Route path="payment/success" element={<OrderSuccess />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </ToastContext.Provider>
  );
}

export default App;

import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';

const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Customize = lazy(() => import('./pages/Customize'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Orders = lazy(() => import('./pages/Orders'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="products" element={<Products />} />
            <Route path="products/:id" element={<ProductDetails />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="customize" element={<Customize />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="payment/success" element={<PaymentSuccess />} />
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/products" element={<AdminProducts />} />
            <Route path="admin/orders" element={<AdminOrders />} />
            <Route path="admin/users" element={<AdminUsers />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

export default App;

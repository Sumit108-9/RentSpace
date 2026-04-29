import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { ToastContext } from '../App';

const Login = () => {
  const navigate = useNavigate();
  const setAuth = useStore((s) => s.setAuth);
  const toast = useContext(ToastContext);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        setAuth(data.user, data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast?.success('Welcome back, ' + (data.user?.name || 'User') + '!');
        navigate(data.user?.role === 'admin' ? '/admin/dashboard' : '/');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Unable to reach server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: '#FAFAF8' }}>
      <div style={{ background: '#fff', border: '1px solid #E8E6DF', borderRadius: 12, padding: 48, width: '100%', maxWidth: 520 }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 600, marginBottom: 12, textAlign: 'center', color: '#2C2C2A' }}>Welcome Back</h2>
        <p style={{ fontSize: 16, color: '#888780', marginBottom: 32, textAlign: 'center', fontFamily: "'DM Sans', sans-serif" }}>Sign in to your RentSpace account</p>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 14, fontWeight: 500, color: '#888780', marginBottom: 8, display: 'block', fontFamily: "'DM Sans', sans-serif" }}>Email</label>
            <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required style={{ width: '100%', height: 48, padding: '0 14px', border: '1px solid #E8E6DF', borderRadius: 8, fontSize: 16, fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 14, fontWeight: 500, color: '#888780', marginBottom: 8, display: 'block', fontFamily: "'DM Sans', sans-serif" }}>Password</label>
            <input type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required style={{ width: '100%', height: 48, padding: '0 14px', border: '1px solid #E8E6DF', borderRadius: 8, fontSize: 16, fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box' }} />
          </div>
          {error && <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '12px 16px', borderRadius: 8, fontSize: 14, marginBottom: 24, textAlign: 'center', fontFamily: "'DM Sans', sans-serif" }}>{error}</div>}
          <button type="submit" disabled={loading} style={{ width: '100%', height: 52, borderRadius: 8, fontSize: 16, fontWeight: 600, background: loading ? '#9bc9b9' : '#1D9E75', color: 'white', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif", marginBottom: 24 }}>{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
        <div style={{ textAlign: 'center', fontSize: 14, color: '#888780', fontFamily: "'DM Sans', sans-serif" }}>
          Don't have an account? <Link to="/register" style={{ color: '#1D9E75', textDecoration: 'none', fontWeight: 500 }}>Sign up</Link>
        </div>
        <div style={{ textAlign: 'center', fontSize: 14, color: '#888780', marginTop: 12, fontFamily: "'DM Sans', sans-serif" }}>
          <Link to="/forgot-password" style={{ color: '#1D9E75', textDecoration: 'none' }}>Forgot password?</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

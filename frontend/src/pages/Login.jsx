import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import useStore from '../store/useStore';
import { ToastContext } from '../App';
import api from '../utils/api';

const Login = () => {
  const navigate = useNavigate();
  const setAuth = useStore((s) => s.setAuth);
  const toast = useContext(ToastContext);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Show cold start message after 3 seconds of waiting
  useEffect(() => {
    if (!loading) {
      setLoadingMsg('');
      return;
    }
    const timer = setTimeout(() => {
      setLoadingMsg('Waking up server... This may take 30s on free hosting.');
    }, 3000);
    return () => clearTimeout(timer);
  }, [loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    console.log('Login attempt:', { email: formData.email, passwordLength: formData.password?.length });
    console.log('Sending login data:', { email: formData.email });
    try {
      // Add timeout for Render cold start - 25 seconds max wait
      const response = await api.post('/auth/login', formData, { timeout: 25000 });
      const data = response.data;
      console.log('Login response:', data);
      if (data.success) {
        setAuth(data.user, data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast?.success('Welcome back, ' + (data.user?.name || 'User') + '!');
        navigate(data.user?.role === 'admin' ? '/admin/dashboard' : '/');
      } else {
        // Show error toast for authentication failures
        toast?.error('Please enter correct email or password', {
          title: 'Login Failed',
          duration: 4000
        });
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error code:', err.code);
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        setError('Server is waking up. Please try again in 30 seconds.');
      } else if (!err.response) {
        setError('Server unavailable. Backend may be starting up - please retry.');
      } else {
        // Show error toast for wrong credentials
        toast?.error('Please enter correct email or password', {
          title: 'Login Failed',
          duration: 4000
        });
        setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      }
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
            <div style={{ position: 'relative' }}>
              <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required style={{ width: '100%', height: 48, padding: '0 14px', paddingRight: 48, border: '1px solid #E8E6DF', borderRadius: 8, fontSize: 16, fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box' }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                {showPassword ? <EyeOff size={20} color="#888780" /> : <Eye size={20} color="#888780" />}
              </button>
            </div>
          </div>
          {error && <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '12px 16px', borderRadius: 8, fontSize: 14, marginBottom: 24, textAlign: 'center', fontFamily: "'DM Sans', sans-serif" }}>{error}</div>}
          <button type="submit" disabled={loading} style={{ width: '100%', height: 52, borderRadius: 8, fontSize: 16, fontWeight: 600, background: loading ? '#9bc9b9' : '#1D9E75', color: 'white', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif", marginBottom: 16 }}>{loading ? 'Signing in...' : 'Sign In'}</button>
          {loadingMsg && (
            <div style={{ textAlign: 'center', fontSize: 13, color: '#888780', marginBottom: 24, fontFamily: "'DM Sans', sans-serif" }}>
              ⏳ {loadingMsg}
            </div>
          )}
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

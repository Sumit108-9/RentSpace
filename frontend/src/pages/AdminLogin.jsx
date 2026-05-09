import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import useStore from '../store/useStore';
import { ToastContext } from '../App';
import api from '../utils/api';

const AdminLogin = () => {
  const navigate = useNavigate();
  const setAuth = useStore((s) => s.setAuth);
  const toast = useContext(ToastContext);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Use api utility to make requests to correct backend URL
      let response = await api.post('/admin/login', formData);
      let data = response.data;
      if (!data.success) {
        // Fallback: use standard auth and verify admin role
        response = await api.post('/auth/login', formData);
        data = response.data;
        if (data.success && data.user?.role !== 'admin') {
          setError('Access denied: admin account required');
          return;
        }
      }
      if (data.success) {
        const adminUser = { ...data.user, role: 'admin' };
        setAuth(adminUser, data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(adminUser));
        toast?.success('Admin access granted');
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Unable to reach server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError('Please enter your email address first');
      return;
    }
    
    try {
      setLoading(true);
      const response = await api.post('/auth/forgot-password', { email: formData.email });
      const data = response.data;
      
      if (data.success) {
        setForgotPasswordSent(true);
        setError('');
        toast?.success('Password reset instructions sent to your email');
      } else {
        setError(data.message || 'Failed to send reset instructions');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(err.response?.data?.message || 'Failed to send reset instructions');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: '#FAFAF8' }}>
      <div style={{ background: '#fff', border: '1px solid #E8E6DF', borderRadius: 12, padding: 48, width: '100%', maxWidth: 520 }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 600, marginBottom: 12, textAlign: 'center', color: '#2C2C2A' }}>Admin Login</h2>
        <p style={{ fontSize: 16, color: '#888780', marginBottom: 32, textAlign: 'center', fontFamily: "'DM Sans', sans-serif" }}>Sign in to admin dashboard</p>
        
        {!forgotPasswordSent ? (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 14, fontWeight: 500, color: '#888780', marginBottom: 8, display: 'block', fontFamily: "'DM Sans', sans-serif" }}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: '#888780' }} />
                <input 
                  type="email" 
                  value={formData.email} 
                  onChange={e => setFormData({ ...formData, email: e.target.value })} 
                  required 
                  style={{ 
                    width: '100%', 
                    height: 48, 
                    padding: '0 14px 0 42px', 
                    border: '1px solid #E8E6DF', 
                    borderRadius: 8, 
                    fontSize: 16, 
                    fontFamily: "'DM Sans', sans-serif", 
                    outline: 'none', 
                    boxSizing: 'border-box' 
                  }} 
                />
              </div>
            </div>
            
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 14, fontWeight: 500, color: '#888780', marginBottom: 8, display: 'block', fontFamily: "'DM Sans', sans-serif" }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: '#888780' }} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={formData.password} 
                  onChange={e => setFormData({ ...formData, password: e.target.value })} 
                  required 
                  style={{ 
                    width: '100%', 
                    height: 48, 
                    padding: '0 42px 0 42px', 
                    border: '1px solid #E8E6DF', 
                    borderRadius: 8, 
                    fontSize: 16, 
                    fontFamily: "'DM Sans', sans-serif", 
                    outline: 'none', 
                    boxSizing: 'border-box' 
                  }} 
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  style={{
                    position: 'absolute',
                    right: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {showPassword ? (
                    <EyeOff style={{ width: 18, height: 18, color: '#888780' }} />
                  ) : (
                    <Eye style={{ width: 18, height: 18, color: '#888780' }} />
                  )}
                </button>
              </div>
            </div>
            
            {error && (
              <div style={{ 
                background: '#FEE2E2', 
                color: '#B91C1C', 
                padding: '12px 16px', 
                borderRadius: 8, 
                fontSize: 14, 
                marginBottom: 24, 
                textAlign: 'center', 
                fontFamily: "'DM Sans', sans-serif" 
              }}>
                {error}
              </div>
            )}
            
            <button 
              type="submit" 
              disabled={loading} 
              style={{ 
                width: '100%', 
                height: 52, 
                borderRadius: 8, 
                fontSize: 16, 
                fontWeight: 600, 
                background: loading ? '#9bc9b9' : '#1D9E75', 
                color: 'white', 
                border: 'none', 
                cursor: loading ? 'not-allowed' : 'pointer', 
                fontFamily: "'DM Sans', sans-serif", 
                marginBottom: 16 
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={loading}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#1D9E75',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 500,
                  fontFamily: "'DM Sans', sans-serif",
                  textDecoration: 'underline'
                }}
              >
                Forgot Password?
              </button>
            </div>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✉️</div>
            <div style={{ fontSize: 18, fontWeight: 500, color: '#2C2C2A', marginBottom: 8 }}>
              Password Reset Email Sent
            </div>
            <div style={{ fontSize: 14, color: '#888780', marginBottom: 24 }}>
              Check your email for password reset instructions
            </div>
            <button
              onClick={() => setForgotPasswordSent(false)}
              style={{
                background: '#1D9E75',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                padding: '12px 24px',
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif"
              }}
            >
              Back to Login
            </button>
          </div>
        )}
        
        <div style={{ textAlign: 'center', fontSize: 14, color: '#888780', fontFamily: "'DM Sans', sans-serif" }}>
          <Link to="/" style={{ color: '#1D9E75', textDecoration: 'none', fontWeight: 500 }}>Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (response.ok) setSent(true);
    } catch (err) {}
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: '#FAFAF8' }}>
      <div style={{ background: '#fff', border: '1px solid #E8E6DF', borderRadius: 12, padding: 48, width: '100%', maxWidth: 520 }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 600, marginBottom: 12, textAlign: 'center', color: '#2C2C2A' }}>Reset Password</h2>
        <p style={{ fontSize: 16, color: '#888780', marginBottom: 32, textAlign: 'center', fontFamily: "'DM Sans', sans-serif" }}>Enter your email to receive reset instructions</p>
        {sent ? (
          <div style={{ textAlign: 'center', fontSize: 16, color: '#085041', marginBottom: 24, fontFamily: "'DM Sans', sans-serif" }}>Reset link sent to your email!</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 14, fontWeight: 500, color: '#888780', marginBottom: 8, display: 'block', fontFamily: "'DM Sans', sans-serif" }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', height: 48, padding: '0 14px', border: '1px solid #E8E6DF', borderRadius: 8, fontSize: 16, fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <button type="submit" style={{ width: '100%', height: 52, borderRadius: 8, fontSize: 16, fontWeight: 600, background: '#1D9E75', color: 'white', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", marginBottom: 24 }}>Send Reset Link</button>
          </form>
        )}
        <div style={{ textAlign: 'center', fontSize: 14, color: '#888780', fontFamily: "'DM Sans', sans-serif" }}>
          <Link to="/login" style={{ color: '#1D9E75', textDecoration: 'none', fontWeight: 500 }}>Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

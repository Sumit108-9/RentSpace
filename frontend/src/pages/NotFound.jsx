import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ minHeight: 'calc(100vh - 48px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: '#FAFAF8' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>404</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, marginBottom: 8 }}>Page Not Found</h2>
        <p style={{ fontSize: 12, color: '#888780', marginBottom: 20 }}>The page you're looking for doesn't exist.</p>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 500, background: '#1D9E75', color: 'white', textDecoration: 'none', border: 'none' }}>Go Home</Link>
      </div>
    </div>
  );
};

export default NotFound;

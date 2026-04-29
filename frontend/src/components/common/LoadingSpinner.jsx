import React from 'react';

const LoadingSpinner = ({ fullScreen }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    minHeight: fullScreen ? '100vh' : '200px',
    background: '#FAFAF8'
  }}>
    <div style={{
      width: '32px', height: '32px', border: '3px solid #e8e6df',
      borderTopColor: '#1D9E75', borderRadius: '50%',
      animation: 'spin 0.8s linear infinite'
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
  </div>
);

export default LoadingSpinner;

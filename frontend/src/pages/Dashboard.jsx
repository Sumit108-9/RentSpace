import React from 'react';
import useStore from '../store/useStore';

const Dashboard = () => {
  const user = useStore((s) => s.user) || {};

  return (
    <div>
        <div style={{ fontSize: 30, fontWeight: 700, marginBottom: 24, color: '#2C2C2A', fontFamily: "'Playfair Display', serif" }}>Welcome back, {user.name?.split(' ')[0] || 'User'}!</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 24 }}>
          {[
            { label: 'Active Orders', value: '2', color: '#1D9E75' },
            { label: 'Total Spent', value: '₹11,391', color: '#085041' },
            { label: 'Wishlist', value: '5', color: '#1D9E75' },
            { label: 'Addresses', value: '1', color: '#085041' },
          ].map((stat, idx) => (
            <div key={idx} style={{ background: '#fff', border: '0.5px solid #E8E6DF', borderRadius: 12, padding: '20px 28px', transition: 'all 0.15s' }}>
              <div style={{ fontSize: 15, color: '#888780', marginBottom: 6 }}>{stat.label}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: stat.color }}>{stat.value}</div>
            </div>
          ))}
        </div>
        <div style={{ background: '#fff', border: '0.5px solid #E8E6DF', borderRadius: 12, padding: '20px 28px', transition: 'all 0.15s' }}>
          <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 16, color: '#2C2C2A' }}>Recent Activity</div>
          <div style={{ fontSize: 16, color: '#888780' }}>No recent activity to show.</div>
        </div>
    </div>
  );
};

export default Dashboard;

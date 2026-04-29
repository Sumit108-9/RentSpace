import React, { useEffect, useState } from 'react';
import useStore from '../store/useStore';

const Profile = () => {
  const user = useStore((s) => s.user) || {};
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    setFormData({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
  }, [user]);

  return (
    <div>
      <div style={{ fontSize: 30, fontWeight: 700, marginBottom: 24, color: '#2C2C2A', fontFamily: "'Playfair Display', serif" }}>My Profile</div>
      <div style={{ background: '#fff', border: '0.5px solid #e8e6df', borderRadius: 12, padding: 32, maxWidth: 620 }}>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 15, fontWeight: 500, color: '#888780', marginBottom: 8, display: 'block' }}>Full Name</label>
          <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '14px 16px', border: '0.5px solid #e8e6df', borderRadius: 8, fontSize: 16, fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 15, fontWeight: 500, color: '#888780', marginBottom: 8, display: 'block' }}>Email</label>
          <input value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} style={{ width: '100%', padding: '14px 16px', border: '0.5px solid #e8e6df', borderRadius: 8, fontSize: 16, fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: 28 }}>
          <label style={{ fontSize: 15, fontWeight: 500, color: '#888780', marginBottom: 8, display: 'block' }}>Phone</label>
          <input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} style={{ width: '100%', padding: '14px 16px', border: '0.5px solid #e8e6df', borderRadius: 8, fontSize: 16, fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <button style={{ padding: '14px 32px', borderRadius: 8, fontSize: 16, fontWeight: 500, background: '#1D9E75', color: 'white', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Save Changes</button>
      </div>
    </div>
  );
};

export default Profile;

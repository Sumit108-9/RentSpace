import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message sent successfully!');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div style={{ padding: 40, maxWidth: 620, margin: '0 auto' }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 700, marginBottom: 10, textAlign: 'center', color: '#2C2C2A' }}>Contact Us</h2>
      <p style={{ fontSize: 15, color: '#888780', marginBottom: 32, textAlign: 'center' }}>We'd love to hear from you</p>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 15, fontWeight: 500, color: '#888780', marginBottom: 8, display: 'block' }}>Name</label>
          <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required style={{ width: '100%', padding: '14px 16px', border: '0.5px solid #e8e6df', borderRadius: 8, fontSize: 16, fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 15, fontWeight: 500, color: '#888780', marginBottom: 8, display: 'block' }}>Email</label>
          <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required style={{ width: '100%', padding: '14px 16px', border: '0.5px solid #e8e6df', borderRadius: 8, fontSize: 16, fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 15, fontWeight: 500, color: '#888780', marginBottom: 8, display: 'block' }}>Message</label>
          <textarea value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} required rows={4} style={{ width: '100%', padding: '14px 16px', border: '0.5px solid #e8e6df', borderRadius: 8, fontSize: 16, fontFamily: "'DM Sans', sans-serif", outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
        </div>
        <button type="submit" style={{ width: '100%', padding: '14px', borderRadius: 8, fontSize: 16, fontWeight: 500, background: '#1D9E75', color: 'white', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Send Message</button>
      </form>
    </div>
  );
};

export default Contact;

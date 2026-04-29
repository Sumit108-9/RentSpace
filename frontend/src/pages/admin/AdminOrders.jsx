import React, { useState, useEffect } from 'react';
import { ShoppingBag, Truck, CheckCircle, XCircle, Clock, RotateCcw } from 'lucide-react';
import useStore from '../../store/useStore';

const STATUS_STYLES = {
  pending:        { bg: '#FEF3C7', color: '#92400E', label: 'Pending' },
  pending_payment:{ bg: '#FEF3C7', color: '#92400E', label: 'Pending Payment' },
  confirmed:      { bg: '#E1F5EE', color: '#085041', label: 'Confirmed' },
  shipped:        { bg: '#E0E7FF', color: '#3730A3', label: 'Shipped' },
  delivered:      { bg: '#DCFCE7', color: '#166534', label: 'Delivered' },
  cancelled:      { bg: '#FEE2E2', color: '#B91C1C', label: 'Cancelled' },
  returned:       { bg: '#F3E8FF', color: '#6B21A8', label: 'Returned' },
  payment_failed: { bg: '#FEE2E2', color: '#B91C1C', label: 'Payment Failed' },
};

const TABS = ['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
const STATUS_OPTIONS = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState(null);

  const getToken = () => useStore.getState().token || localStorage.getItem('token');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders', { headers: { Authorization: `Bearer ${getToken()}` } });
      const data = await res.json();
      if (data.success) setOrders(data.orders || []);
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) fetchOrders();
    } catch (e) {}
    setUpdating(null);
  };

  const filtered = orders.filter(o => {
    if (activeTab !== 'all' && o.orderStatus !== activeTab) return false;
    if (search) {
      const q = search.toLowerCase();
      const num = o.orderNumber || o._id?.slice(-6);
      const name = o.user?.name || '';
      if (!num.toLowerCase().includes(q) && !name.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const totalRevenue = orders.filter(o => o.isPaid).reduce((s, o) => s + (o.totalAmount || 0), 0);
  const stats = [
    { icon: ShoppingBag, label: 'Total Orders', value: orders.length, color: '#1D9E75' },
    { icon: Clock, label: 'Pending', value: orders.filter(o => o.orderStatus === 'pending' || o.orderStatus === 'pending_payment').length, color: '#92400E' },
    { icon: Truck, label: 'Shipped', value: orders.filter(o => o.orderStatus === 'shipped').length, color: '#3730A3' },
    { icon: CheckCircle, label: 'Delivered', value: orders.filter(o => o.orderStatus === 'delivered').length, color: '#166534' },
  ];

  const inputStyle = { padding: '12px 14px', border: '0.5px solid #e8e6df', borderRadius: 8, fontSize: 15, fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box' };

  return (
    <div>
      <div style={{ fontSize: 30, fontWeight: 700, marginBottom: 24, color: '#2C2C2A', fontFamily: "'Playfair Display', serif" }}>Orders</div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 24 }}>
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} style={{ background: '#fff', border: '0.5px solid #E8E6DF', borderRadius: 12, padding: '20px 28px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: '#E1F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon style={{ width: 22, height: 22, stroke: s.color, fill: 'none' }} />
              </div>
              <div>
                <div style={{ fontSize: 14, color: '#888780', marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#2C2C2A' }}>{loading ? '—' : s.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '0.5px solid #e8e6df', marginBottom: 20, background: '#fff', borderRadius: '8px 8px 0 0', padding: '0 8px' }}>
        {TABS.map(tab => (
          <div key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '14px 24px', fontSize: 15, cursor: 'pointer', borderBottom: '2.5px solid transparent', color: activeTab === tab ? '#1D9E75' : '#888780', borderBottomColor: activeTab === tab ? '#1D9E75' : 'transparent', fontWeight: activeTab === tab ? 600 : 400, transition: 'all 0.15s', textTransform: 'capitalize' }}>
            {tab === 'all' ? `All (${orders.length})` : `${tab.charAt(0).toUpperCase() + tab.slice(1)} (${orders.filter(o => o.orderStatus === tab).length})`}
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <input placeholder="Search by order # or customer name..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, width: '100%', maxWidth: 360 }} />
      </div>

      {/* Count */}
      <div style={{ fontSize: 14, color: '#888780', marginBottom: 16 }}>{filtered.length} order{filtered.length !== 1 ? 's' : ''}</div>

      {/* Table */}
      <div style={{ background: '#fff', border: '0.5px solid #E8E6DF', borderRadius: 12, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#888780', fontSize: 15 }}>Loading orders...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#888780', fontSize: 15 }}>No orders found</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['ORDER ID', 'CUSTOMER', 'ITEMS', 'AMOUNT', 'PAYMENT', 'STATUS', 'DATE', 'ACTION'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '14px 14px', color: '#888780', fontWeight: 500, fontSize: 12, letterSpacing: '0.04em', borderBottom: '0.5px solid #E8E6DF', background: '#FAFAF8' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => {
                const st = STATUS_STYLES[o.orderStatus] || STATUS_STYLES.pending;
                return (
                  <tr key={o._id} style={{ borderBottom: '0.5px solid #F5F4F0' }}>
                    <td style={{ padding: '14px 14px', fontSize: 15, color: '#1D9E75', fontWeight: 500 }}>
                      #{o.orderNumber || o._id?.slice(-6)}
                    </td>
                    <td style={{ padding: '14px 14px' }}>
                      <div style={{ fontSize: 14, fontWeight: 500, color: '#2C2C2A' }}>{o.user?.name || 'Guest'}</div>
                      <div style={{ fontSize: 12, color: '#888780' }}>{o.user?.email || ''}</div>
                    </td>
                    <td style={{ padding: '14px 14px', fontSize: 14, color: '#2C2C2A' }}>
                      {o.orderItems?.length || 0} item{(o.orderItems?.length || 0) !== 1 ? 's' : ''}
                    </td>
                    <td style={{ padding: '14px 14px', fontSize: 15, fontWeight: 600, color: '#2C2C2A' }}>
                      ₹{(o.totalAmount || 0).toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '14px 14px' }}>
                      {(() => {
                        const method = o.paymentInfo?.method;
                        const isOnline = method && method !== 'cod';
                        return (
                          <span style={{ fontSize: 12, padding: '3px 12px', borderRadius: 20, fontWeight: 500, background: isOnline ? '#DCFCE7' : '#FEE2E2', color: isOnline ? '#166534' : '#B91C1C' }}>
                            {isOnline ? 'Online' : 'COD'}
                          </span>
                        );
                      })()}
                    </td>
                    <td style={{ padding: '14px 14px' }}>
                      <span style={{ fontSize: 12, padding: '3px 12px', borderRadius: 20, fontWeight: 500, background: st.bg, color: st.color }}>
                        {st.label}
                      </span>
                    </td>
                    <td style={{ padding: '14px 14px', fontSize: 13, color: '#888780' }}>
                      {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </td>
                    <td style={{ padding: '14px 14px' }}>
                      <select
                        value={o.orderStatus}
                        onChange={e => handleStatusChange(o._id, e.target.value)}
                        disabled={updating === o._id}
                        style={{ padding: '6px 10px', borderRadius: 6, border: '0.5px solid #e8e6df', fontSize: 13, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', outline: 'none', opacity: updating === o._id ? 0.5 : 1 }}
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useStore from '../store/useStore';
import api from '../utils/api';

const Orders = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = useStore((s) => s.user);
  const userId = user?._id || user?.id;

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError('');
      
      if (!userId) {
        setOrders([]);
        setLoading(false);
        return;
      }
      
      try {
        const response = await api.get('/orders');
        const data = response.data;
        if (data.success) {
          // Transform real orders to match the display format
          const transformedOrders = data.orders?.map(order => ({
            _id: order.orderNumber || order._id,
            name: order.orderItems?.[0]?.name || 'Furniture Rental',
            duration: order.orderItems?.[0]?.rentalDuration || 3,
            date: new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            price: order.totalAmount,
            status: order.orderStatus === 'pending' ? 'Pending' : 
                    order.orderStatus === 'delivered' ? 'Delivered' : 
                    order.orderStatus === 'cancelled' ? 'Cancelled' : 'Active',
            image: order.orderItems?.[0]?.image,
            icon: '📦'
          })) || [];
          setOrders(transformedOrders);
        } else {
          setError(data.message || 'Failed to load orders');
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setError('Unable to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userId]);

  const getStatusBadge = (status) => {
    const styles = {
      Active: { bg: '#E1F5EE', color: '#085041' },
      Delivered: { bg: '#E6F1FB', color: '#185FA5' },
      Pending: { bg: '#FAEEDA', color: '#854F0B' },
      Cancelled: { bg: '#FCEBEB', color: '#A32D2D' },
    };
    const s = styles[status] || styles.Pending;
    return <span style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 20, fontSize: 15, fontWeight: 500, background: s.bg, color: s.color }}>{status}</span>;
  };

  const filteredOrders = orders.filter(o => activeTab === 'all' || o.status.toLowerCase() === activeTab);

  return (
    <div>
      <div style={{ fontSize: 30, fontWeight: 700, marginBottom: 24, color: '#2C2C2A', fontFamily: "'Playfair Display', serif" }}>My Orders</div>
      <div style={{ display: 'flex', gap: 0, borderBottom: '0.5px solid #e8e6df', marginBottom: 24, background: '#fff', borderRadius: '8px 8px 0 0', padding: '0 8px' }}>
        {['All', 'Active', 'Delivered', 'Cancelled'].map(tab => (
          <div key={tab} onClick={() => setActiveTab(tab.toLowerCase())} style={{ padding: '14px 24px', fontSize: 18, cursor: 'pointer', borderBottom: '2.5px solid transparent', color: activeTab === tab.toLowerCase() ? '#1D9E75' : '#888780', transition: 'all 0.15s', borderBottomColor: activeTab === tab.toLowerCase() ? '#1D9E75' : 'transparent', fontWeight: activeTab === tab.toLowerCase() ? 600 : 400 }}>{tab}</div>
        ))}
      </div>

      {loading && <div style={{ textAlign: 'center', padding: 40, color: '#888780' }}>Loading orders...</div>}
      
      {error && !loading && (
        <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '12px 16px', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>
          {error}
        </div>
      )}
      
      {!loading && filteredOrders.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#FAFAF8', borderRadius: 12, border: '0.5px solid #E8E6DF' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
          <div style={{ fontSize: 20, color: '#2C2C2A', marginBottom: 8, fontWeight: 500 }}>No orders yet</div>
          <div style={{ fontSize: 16, color: '#888780' }}>Your orders will appear here once you make a purchase.</div>
        </div>
      )}
      
      {filteredOrders.map((order) => (
        <div key={order._id} style={{ background: '#fff', border: '0.5px solid #e8e6df', borderRadius: 12, padding: '20px 28px', display: 'flex', gap: 20, alignItems: 'center', marginBottom: 16 }}>
          <div style={{ width: 72, height: 72, background: '#f5f4f0', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, flexShrink: 0, overflow: 'hidden' }}>
            {order.image ? <img src={order.image} alt={order.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : order.icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, color: '#888780', marginBottom: 4 }}>#{order._id}</div>
            <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 4, color: '#2C2C2A' }}>{order.name}</div>
            <div style={{ fontSize: 16, color: '#888780' }}>{order.duration} Months · {order.status === 'Delivered' ? `Delivered on: ${order.date}` : `Order Date: ${order.date}`}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#2C2C2A', marginBottom: 6 }}>₹{order.price.toLocaleString('en-IN')}</div>
            {getStatusBadge(order.status)}
            <Link to={`/orders/${order._id}`} style={{ fontSize: 15, color: '#1D9E75', cursor: 'pointer', marginTop: 8, display: 'block', textDecoration: 'none' }}>View Details →</Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;

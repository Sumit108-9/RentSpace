import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import api from '../utils/api';

const Dashboard = () => {
  const user = useStore((s) => s.user) || {};
  const [stats, setStats] = useState({
    activeOrders: 0,
    totalSpent: 0,
    wishlist: 0,
    addresses: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch orders
        const ordersRes = await api.get('/orders');
        const ordersData = ordersRes.data;
        
        if (ordersData.success) {
          const orders = ordersData.orders || [];
          
          // Calculate active orders (pending, confirmed, shipped)
          const activeOrders = orders.filter(o => 
            ['pending', 'confirmed', 'shipped'].includes(o.orderStatus)
          ).length;
          
          // Calculate total spent from paid orders
          const totalSpent = orders
            .filter(o => o.isPaid)
            .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
          
          // Get recent orders (last 3)
          const recent = orders.slice(0, 3);
          
          setStats(prev => ({
            ...prev,
            activeOrders,
            totalSpent
          }));
          setRecentOrders(recent);
        }
        
        // Get wishlist count from user
        if (user?.wishlist) {
          setStats(prev => ({
            ...prev,
            wishlist: user.wishlist.length
          }));
        }
        
        // Get addresses count from user
        if (user?.address) {
          const addrCount = Array.isArray(user.address) 
            ? user.address.length 
            : (user.address && Object.keys(user.address).length > 0 ? 1 : 0);
          setStats(prev => ({
            ...prev,
            addresses: addrCount
          }));
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user]);

  const formatCurrency = (amount) => {
    return '₹' + amount.toLocaleString('en-IN');
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#854F0B',
      confirmed: '#1D9E75',
      shipped: '#185FA5',
      delivered: '#085041',
      cancelled: '#B91C1C'
    };
    return colors[status] || '#888780';
  };

  const dashboardStats = [
    { label: 'Active Orders', value: stats.activeOrders, color: '#1D9E75' },
    { label: 'Total Spent', value: formatCurrency(stats.totalSpent), color: '#085041' },
    { label: 'Wishlist', value: stats.wishlist, color: '#1D9E75' },
    { label: 'Addresses', value: stats.addresses, color: '#085041' },
  ];

  return (
    <div>
        <div style={{ fontSize: 30, fontWeight: 700, marginBottom: 24, color: '#2C2C2A', fontFamily: "'Playfair Display', serif" }}>Welcome back, {user.name?.split(' ')[0] || 'User'}!</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 24 }}>
          {dashboardStats.map((stat, idx) => (
            <div key={idx} style={{ background: '#fff', border: '0.5px solid #E8E6DF', borderRadius: 12, padding: '20px 28px', transition: 'all 0.15s' }}>
              <div style={{ fontSize: 15, color: '#888780', marginBottom: 6 }}>{stat.label}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: stat.color }}>{stat.value}</div>
            </div>
          ))}
        </div>
        
        {/* Recent Activity */}
        <div style={{ background: '#fff', border: '0.5px solid #E8E6DF', borderRadius: 12, padding: '20px 28px', transition: 'all 0.15s' }}>
          <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 16, color: '#2C2C2A' }}>Recent Activity</div>
          {loading ? (
            <div style={{ fontSize: 16, color: '#888780', textAlign: 'center', padding: 20 }}>Loading...</div>
          ) : recentOrders.length === 0 ? (
            <div style={{ fontSize: 16, color: '#888780', textAlign: 'center', padding: 20 }}>No recent activity to show.</div>
          ) : (
            <div>
              {recentOrders.map((order) => (
                <div key={order._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '0.5px solid #E8E6DF' }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 500, color: '#2C2C2A' }}>
                      Order #{order.orderNumber || order._id}
                    </div>
                    <div style={{ fontSize: 14, color: '#888780' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 16, fontWeight: 600, color: '#2C2C2A' }}>
                      {formatCurrency(order.totalAmount || 0)}
                    </div>
                    <div style={{ fontSize: 13, color: getStatusColor(order.orderStatus), textTransform: 'capitalize' }}>
                      {order.orderStatus}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
    </div>
  );
};

export default Dashboard;

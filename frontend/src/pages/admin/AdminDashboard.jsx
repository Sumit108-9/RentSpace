import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ShoppingBag, CreditCard, Clock, XCircle, IndianRupee, Wallet, CheckCircle2, Activity, Users } from 'lucide-react';
import useStore from '../../store/useStore';
import api from '../../utils/api';

const formatINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

const STATUS_STYLES = {
  pending:   { bg: '#FEF3C7', fg: '#92400E' },
  confirmed: { bg: '#DBEAFE', fg: '#1E40AF' },
  active:    { bg: '#DBEAFE', fg: '#1E40AF' },
  shipped:   { bg: '#E0E7FF', fg: '#3730A3' },
  delivered: { bg: '#DCFCE7', fg: '#166534' },
  cancelled: { bg: '#FEE2E2', fg: '#B91C1C' },
  returned:  { bg: '#F3E8FF', fg: '#6B21A8' },
};

const AdminDashboard = () => {
  const { adminOrders, adminOrdersLoading, fetchAdminOrders } = useStore();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, activeRentals: 0, totalCustomers: 0, totalProducts: 0 });
  const [revenueByMonth, setRevenueByMonth] = useState([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const response = await api.get('/admin/stats');
        const data = response.data;
        if (data.success) {
          setStats(data.stats || { totalOrders: 0, totalRevenue: 0, activeRentals: 0, totalCustomers: 0, totalProducts: 0 });
          setRevenueByMonth(data.revenueByMonth || []);
        } else {
          setStats({ totalOrders: 0, totalRevenue: 0, activeRentals: 0, totalCustomers: 0, totalProducts: 0 });
          setRevenueByMonth([]);
        }
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
        setStats({ totalOrders: 0, totalRevenue: 0, activeRentals: 0, totalCustomers: 0, totalProducts: 0 });
        setRevenueByMonth([]);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
    // Fetch shared admin orders
    fetchAdminOrders();
  }, [fetchAdminOrders]);

  // Get recent orders from shared store (first 7)
  const recentOrders = adminOrders.slice(0, 7);

  // Order count cards
  const countCards = [
    { label: 'Total Orders',       value: stats.totalOrders,       icon: ShoppingBag,  color: '#1D9E75', bg: '#E8F7F1' },
    { label: 'Online Paid Orders', value: stats.onlinePaidOrders,  icon: CreditCard,   color: '#1E40AF', bg: '#DBEAFE' },
    { label: 'COD Pending Orders', value: stats.codPendingOrders,  icon: Clock,        color: '#92400E', bg: '#FEF3C7' },
    { label: 'Cancelled Orders',   value: stats.cancelledOrders,   icon: XCircle,      color: '#B91C1C', bg: '#FEE2E2' },
  ];

  // Revenue/amount cards
  const moneyCards = [
    { label: 'Total Revenue',         value: formatINR(stats.totalRevenue),        icon: IndianRupee,  color: '#1D9E75', bg: '#E8F7F1', hint: 'Paid + Collected' },
    { label: 'Pending COD Amount',    value: formatINR(stats.pendingCODAmount),    icon: Wallet,       color: '#92400E', bg: '#FEF3C7', hint: 'Awaiting collection' },
    { label: 'COD Collected Revenue', value: formatINR(stats.codCollectedRevenue), icon: CheckCircle2, color: '#1E40AF', bg: '#DBEAFE', hint: 'Cash received' },
  ];

  // Other stats
  const miscCards = [
    { label: 'Active Rentals',  value: stats.activeRentals,  icon: Activity, color: '#3730A3', bg: '#E0E7FF' },
    { label: 'Total Customers', value: stats.totalCustomers, icon: Users,    color: '#6B21A8', bg: '#F3E8FF' },
  ];

  return (
    <main style={{ flex: 1, overflowY: 'auto', background: '#F5F4F0', padding: 26 }}>

          {/* Header row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 30, fontWeight: 700, fontFamily: "'Playfair Display', serif", color: '#2C2C2A' }}>Dashboard</div>
            <div style={{ fontSize: 15, color: '#888780', background: '#fff', border: '0.5px solid #E8E6DF', borderRadius: 8, padding: '8px 16px' }}>↑ 18 Apr – 18 May 2024</div>
          </div>

          {/* Order count cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 16 }}>
            {countCards.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} style={{ background: '#fff', borderRadius: 12, border: '0.5px solid #E8E6DF', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: s.bg, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={22} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: '#888780', marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#2C2C2A', lineHeight: 1.1 }}>{loading ? '—' : Number(s.value || 0).toLocaleString('en-IN')}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Revenue / amount cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 16 }}>
            {moneyCards.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} style={{ background: '#fff', borderRadius: 12, border: '0.5px solid #E8E6DF', padding: '16px 18px', borderLeft: `4px solid ${s.color}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: s.bg, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={18} />
                    </div>
                    <div style={{ fontSize: 13, color: '#888780' }}>{s.label}</div>
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 700, color: s.color, marginBottom: 4 }}>{loading ? '—' : s.value}</div>
                  <div style={{ fontSize: 12, color: '#A8A6A0' }}>{s.hint}</div>
                </div>
              );
            })}
          </div>

          {/* Misc cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
            {miscCards.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} style={{ background: '#fff', borderRadius: 12, border: '0.5px solid #E8E6DF', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: s.bg, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={22} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: '#888780', marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#2C2C2A', lineHeight: 1.1 }}>{loading ? '—' : Number(s.value || 0).toLocaleString('en-IN')}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Orders + Revenue Overview */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>

            {/* Recent Orders table */}
            <div style={{ background: '#fff', border: '0.5px solid #E8E6DF', borderRadius: 12, padding: '10px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 20, fontWeight: 600, color: '#2C2C2A' }}>Recent Orders</div>
                <Link to="/admin/orders" style={{ fontSize: 15, color: '#1D9E75', textDecoration: 'none' }}>View All →</Link>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['ORDER ID', 'CUSTOMER', 'AMOUNT', 'STATUS', 'DATE'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '10px 12px', color: '#888780', fontWeight: 500, fontSize: 13, letterSpacing: '0.04em', borderBottom: '0.5px solid #E8E6DF' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#888780', fontSize: 15 }}>
                        No orders found. Orders will appear here once customers place them.
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((o) => {
                      const sc = STATUS_STYLES[o.orderStatus] || STATUS_STYLES.pending;
                      const label = o.orderStatus === 'confirmed' ? 'Active' : o.orderStatus.charAt(0).toUpperCase() + o.orderStatus.slice(1);
                      return (
                        <tr key={o._id} style={{ borderBottom: '0.5px solid #F5F4F0' }}>
                          <td style={{ padding: '12px 12px', fontSize: 15, color: '#1D9E75', fontWeight: 500 }}>#{o.orderNumber || o._id?.slice(-6)}</td>
                          <td style={{ padding: '12px 12px', fontSize: 15, color: '#2C2C2A' }}>{o.user?.name || 'Guest'}</td>
                          <td style={{ padding: '12px 12px', fontSize: 15, color: '#2C2C2A', fontWeight: 500 }}>{formatINR(o.totalAmount)}</td>
                          <td style={{ padding: '12px 12px' }}>
                            <span style={{ background: sc.bg, color: sc.fg, padding: '4px 14px', borderRadius: 20, fontSize: 15, fontWeight: 500 }}>{label}</span>
                          </td>
                          <td style={{ padding: '12px 12px', fontSize: 15, color: '#888780' }}>
                            {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Revenue Overview chart */}
            <div style={{ background: '#fff', border: '0.5px solid #E8E6DF', borderRadius: 12, padding: '10px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 20, fontWeight: 600, color: '#2C2C2A' }}>Revenue Overview</div>
                <span style={{ fontSize: 15, color: '#888780' }}>This Month</span>
              </div>
              <div style={{ width: '100%', height: 260 }}>
                {revenueByMonth.length === 0 ? (
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888780', fontSize: 14 }}>
                    No revenue data available yet.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueByMonth} margin={{ top: 4, right: 4, left: -30, bottom: 0 }}>
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#888780', fontSize: 10 }} />
                      <Tooltip
                        formatter={(v) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Revenue']}
                        contentStyle={{ background: '#fff', border: '0.5px solid #E8E6DF', borderRadius: 8, fontSize: 11 }}
                      />
                      <Bar dataKey="revenue" fill="#1D9E75" radius={[3, 3, 0, 0]} maxBarSize={16} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
      </main>
  );
};

export default AdminDashboard;

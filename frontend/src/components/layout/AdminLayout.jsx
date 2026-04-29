import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Grid, ShoppingBag, Box, Users, CreditCard, BarChart3, Settings, LogOut, Bell, ExternalLink } from 'lucide-react';
import useStore from '../../store/useStore';

const NAV_ITEMS = [
  { icon: Grid,        label: 'Dashboard',  to: '/admin/dashboard' },
  { icon: ShoppingBag, label: 'Orders',     to: '/admin/orders' },
  { icon: Box,         label: 'Products',   to: '/admin/products' },
  { icon: Users,       label: 'Customers',  to: '/admin/users' },
  { icon: CreditCard,  label: 'Payments',   to: '/admin/dashboard' },
  { icon: BarChart3,   label: 'Reports',    to: '/admin/dashboard' },
  { icon: Settings,    label: 'Settings',   to: '/admin/dashboard' },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = useStore((s) => s.user);
  const storeLogout = useStore((s) => s.logout);

  const handleLogout = () => { storeLogout(); navigate('/admin/login'); };
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'AD';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', fontFamily: 'DM Sans, sans-serif' }}>

      {/* ── Top dark header ── */}
      <header style={{ height: 100, background: '#063831', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 38px', flexShrink: 0, zIndex: 100, borderBottom: '1px solid #1a4a3d' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <img src="/images/admin-logo.png" alt="RentSpace" style={{ height: 90, width: 'auto', objectFit: 'contain' }} />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <a href="/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 18px', borderRadius: 8, background: '#2CA37A', color: '#fff', fontSize: 14, fontWeight: 500, textDecoration: 'none', transition: 'opacity 0.15s' }}>
            <ExternalLink style={{ width: 16, height: 16, stroke: '#fff', fill: 'none' }} />View Store
          </a>
          <Bell style={{ width: 24, height: 24, stroke: '#9a9a95', fill: 'none', cursor: 'pointer' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#1D9E75', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#fff' }}>{initials}</div>
            <span style={{ fontSize: 17, color: '#c8c8c0' }}>Admin</span>
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── Dark green sidebar ── */}
        <aside style={{ width: 210, background: '#063831', display: 'flex', flexDirection: 'column', padding: '10px 0', flexShrink: 0, borderRight: '1px solid #1a4a3d' }}>
          {NAV_ITEMS.map((item, idx) => {
            const active = pathname === item.to;
            const Icon = item.icon;
            return (
              <Link key={idx} to={item.to} style={{ textDecoration: 'none', position: 'relative' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 18px',
                  fontSize: 19,
                  color: active ? '#fff' : '#6a9a7a',
                  background: active ? '#0d4a3d' : 'transparent',
                  fontWeight: active ? 600 : 400,
                  transition: 'all 0.15s',
                  borderRadius: '4px',
                  margin: '0 10px'
                }}>
                  <Icon style={{ width: 22, height: 22, stroke: 'currentColor', fill: 'none', flexShrink: 0 }} />
                  {item.label}
                </div>
                {active && (
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '4px',
                    background: '#1D9E75',
                    borderRadius: '0 2px 2px 0'
                  }} />
                )}
              </Link>
            );
          })}
          <div onClick={handleLogout} style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', fontSize: 19, color: '#6a9a7a', cursor: 'pointer' }}>
            <LogOut style={{ width: 22, height: 22, stroke: 'currentColor', fill: 'none', flexShrink: 0 }} />Logout
          </div>
        </aside>

        {/* ── Main content ── */}
        <main style={{ flex: 1, overflowY: 'auto', background: '#F5F4F0', padding: 26 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

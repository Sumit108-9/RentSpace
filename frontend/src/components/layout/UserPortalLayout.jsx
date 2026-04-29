import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Grid, ShoppingBag, Heart, User, Home, CreditCard, HelpCircle, LogOut, Bell } from 'lucide-react';
import useStore from '../../store/useStore';

const navItems = [
  { icon: Grid, label: 'Dashboard', to: '/dashboard' },
  { icon: ShoppingBag, label: 'My Orders', to: '/orders' },
  { icon: Heart, label: 'Wishlist', to: '/wishlist' },
  { icon: User, label: 'Profile', to: '/profile' },
  { icon: Home, label: 'Addresses', to: '/profile' },
  { icon: CreditCard, label: 'Payments', to: '/profile' },
  { icon: HelpCircle, label: 'Support', to: '/contact' },
];

const UserPortalLayout = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = useStore((s) => s.user);
  const logout = useStore((s) => s.logout);

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#F5F4F0', fontFamily: 'DM Sans, sans-serif' }}>
      {/* Top bar */}
      <header style={{ height: 100, background: '#fff', borderBottom: '0.5px solid #E8E6DF', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 38px', flexShrink: 0, position: 'sticky', top: 0, zIndex: 100 }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <img src="/images/user-logo.png" alt="RentSpace" style={{ height: 90, width: 'auto', objectFit: 'contain' }} />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Bell style={{ width: 24, height: 24, stroke: '#888780', fill: 'none', cursor: 'pointer' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#E1F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 600, color: '#085041' }}>{initials}</div>
            <span style={{ fontSize: 17, color: '#2C2C2A' }}>Hi, {user?.name?.split(' ')[0] || 'User'}</span>
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <aside style={{ width: 210, background: '#fff', borderRight: '0.5px solid #E8E6DF', display: 'flex', flexDirection: 'column', padding: '10px 0', flexShrink: 0 }}>
          {navItems.map((item, idx) => {
            const active = pathname === item.to;
            const Icon = item.icon;
            return (
              <Link key={idx} to={item.to} style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', fontSize: 19, color: active ? '#1D9E75' : '#888780', background: active ? '#E1F5EE' : 'transparent', fontWeight: active ? 600 : 400, transition: 'all 0.15s', borderRadius: active ? '0 8px 8px 0' : 0 }}>
                  <Icon style={{ width: 22, height: 22, stroke: 'currentColor', fill: 'none', flexShrink: 0 }} />
                  {item.label}
                </div>
              </Link>
            );
          })}
          <div onClick={() => { logout(); navigate('/'); }} style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', fontSize: 19, color: '#888780', cursor: 'pointer' }}>
            <LogOut style={{ width: 22, height: 22, stroke: 'currentColor', fill: 'none', flexShrink: 0 }} />Logout
          </div>
        </aside>

        {/* Content */}
        <main style={{ flex: 1, overflowY: 'auto', background: '#F5F4F0', padding: 26 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserPortalLayout;

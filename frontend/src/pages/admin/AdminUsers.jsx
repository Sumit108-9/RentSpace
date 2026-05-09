import React, { useState, useEffect } from 'react';
import { Users, UserCheck, Mail, Search } from 'lucide-react';
import useStore from '../../store/useStore';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const getToken = () => useStore.getState().token || localStorage.getItem('token');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/admin/users', { headers: { Authorization: `Bearer ${getToken()}` } });
        const data = await res.json();
        if (data.success) setUsers(data.users || []);
      } catch (e) {
        setUsers([]);
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const filtered = users.filter(u => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!u.name?.toLowerCase().includes(q) && !u.email?.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const totalUsers = users.length;
  const verifiedCount = users.filter(u => u.isEmailVerified).length;
  const adminCount = users.filter(u => u.role === 'admin').length;

  const statCards = [
    { icon: Users, label: 'Total Customers', value: totalUsers, color: '#1D9E75' },
    { icon: UserCheck, label: 'Verified', value: verifiedCount, color: '#085041' },
    { icon: Mail, label: 'Unverified', value: totalUsers - verifiedCount, color: '#92400E' },
  ];

  const inputStyle = { width: '100%', padding: '12px 14px', border: '0.5px solid #e8e6df', borderRadius: 8, fontSize: 15, fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box' };

  return (
    <div>
      <div style={{ fontSize: 30, fontWeight: 700, marginBottom: 24, color: '#2C2C2A', fontFamily: "'Playfair Display', serif" }}>Customers</div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 24 }}>
        {statCards.map((s, idx) => {
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

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <div style={{ position: 'relative', maxWidth: 320, flex: 1 }}>
          <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, stroke: '#888780' }} />
          <input placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, paddingLeft: 38 }} />
        </div>
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} style={{ ...inputStyle, maxWidth: 160 }}>
          <option value="all">All Roles</option>
          <option value="user">Users</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {/* Count */}
      <div style={{ fontSize: 14, color: '#888780', marginBottom: 16 }}>{filtered.length} customer{filtered.length !== 1 ? 's' : ''} found</div>

      {/* Table */}
      <div style={{ background: '#fff', border: '0.5px solid #E8E6DF', borderRadius: 12, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#888780', fontSize: 15 }}>Loading customers...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#888780', fontSize: 15 }}>No customers available. Users will appear here once they register.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['CUSTOMER', 'EMAIL', 'PHONE', 'ROLE', 'VERIFIED', 'JOINED'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '14px 16px', color: '#888780', fontWeight: 500, fontSize: 12, letterSpacing: '0.04em', borderBottom: '0.5px solid #E8E6DF', background: '#FAFAF8' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u._id} style={{ borderBottom: '0.5px solid #F5F4F0' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#E1F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 600, color: '#085041', flexShrink: 0 }}>
                        {u.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 500, color: '#2C2C2A' }}>{u.name || 'Unknown'}</div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 14, color: '#2C2C2A' }}>{u.email}</td>
                  <td style={{ padding: '14px 16px', fontSize: 14, color: u.phone ? '#2C2C2A' : '#888780' }}>{u.phone || '—'}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: 12, padding: '3px 12px', borderRadius: 20, fontWeight: 500, textTransform: 'capitalize', background: u.role === 'admin' ? '#E0E7FF' : '#E1F5EE', color: u.role === 'admin' ? '#3730A3' : '#085041' }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: 12, padding: '3px 12px', borderRadius: 20, fontWeight: 500, background: u.isEmailVerified ? '#DCFCE7' : '#FEF3C7', color: u.isEmailVerified ? '#166534' : '#92400E' }}>
                      {u.isEmailVerified ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 14, color: '#888780' }}>
                    {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;

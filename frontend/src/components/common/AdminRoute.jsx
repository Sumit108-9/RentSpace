import React from 'react';
import { Navigate } from 'react-router-dom';
import useStore from '../../store/useStore';

const AdminRoute = ({ children }) => {
  const storeToken = useStore((s) => s.token);
  const storeUser = useStore((s) => s.user);
  const hasRehydrated = useStore((s) => s.hasRehydrated);

  const lsToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  let lsUser = {};
  try { lsUser = JSON.parse(localStorage.getItem('user') || '{}'); } catch {}

  const token = storeToken || lsToken;
  const user = storeUser || lsUser;

  // Wait for Zustand rehydration to avoid flashing redirect
  if (!hasRehydrated && lsToken) return null;

  if (!token || user?.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

export default AdminRoute;

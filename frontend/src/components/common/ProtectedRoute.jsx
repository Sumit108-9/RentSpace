import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useStore from '../../store/useStore';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const storeToken = useStore((s) => s.token);
  const hasRehydrated = useStore((s) => s.hasRehydrated);
  const lsToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const token = storeToken || lsToken;

  // Wait for Zustand rehydration to avoid flashing redirect
  if (!hasRehydrated && lsToken) return null;

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
};

export default ProtectedRoute;

import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import useStore from '../../store/useStore';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, hasRehydrated } = useStore();
  const [forceShow, setForceShow] = useState(false);

  // Fallback: force show after 2 seconds max
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('ProtectedRoute: forceShow triggered');
      setForceShow(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  console.log('ProtectedRoute render:', { 
    isAuthenticated, 
    hasUser: !!user, 
    hasRehydrated,
    forceShow,
    userId: user?._id 
  });

  // Show spinner while rehydrating (but max 2 seconds)
  if (!hasRehydrated && !forceShow) {
    return <LoadingSpinner fullScreen />;
  }

  // After rehydration or forceShow, check auth
  if (!isAuthenticated && !user) {
    console.log('ProtectedRoute: redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('ProtectedRoute: rendering children');
  return children;
};

export default ProtectedRoute;

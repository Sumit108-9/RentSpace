import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ fullScreen = false, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-primary-600`} />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary-600`} />
    </div>
  );
};

export default LoadingSpinner;

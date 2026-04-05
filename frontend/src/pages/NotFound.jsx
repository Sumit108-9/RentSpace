import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center py-16">
      <div className="container-custom text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-9xl font-bold text-primary-200 mb-4">404</div>
          <h1 className="text-3xl font-bold text-secondary-900 mb-4">Page Not Found</h1>
          <p className="text-secondary-600 mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back on track.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="btn-primary">
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
            <Link to="/products" className="btn-outline">
              <Search className="w-5 h-5 mr-2" />
              Browse Products
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;

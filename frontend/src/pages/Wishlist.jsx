import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowRight, Package } from 'lucide-react';
import api from '../utils/api';
import useStore from '../store/useStore';
import ProductCard from '../components/common/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const navigate = useNavigate();
  const { wishlist, removeFromWishlist } = useStore();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mode, setMode] = useState('rent');

  useEffect(() => {
    // Use wishlist from store directly (full product objects)
    setProducts(wishlist);
    setIsLoading(false);
  }, [wishlist]);

  const handleRemove = async (productId) => {
    // Remove locally first (optimistic UI)
    removeFromWishlist(productId);
    setProducts(products.filter(p => p._id !== productId));
    toast.success('Removed from wishlist');
    
    // Try API in background (non-blocking)
    api.delete(`/users/wishlist/${productId}`).catch(() => {});
  };

  if (isLoading) return <LoadingSpinner fullScreen />;

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-secondary-50 py-16">
        <div className="container-custom text-center">
          <div className="w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-12 h-12 text-secondary-400" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Your wishlist is empty</h1>
          <p className="text-secondary-600 mb-8">Save items you love for later</p>
          <Link to="/products" className="btn-primary">
            Explore Products
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Wishlist ({products.length})</h1>
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setMode('buy')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                mode === 'buy'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => setMode('rent')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                mode === 'rent'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Rent
            </button>
          </div>
          <Link to="/products" className="btn-outline">
            Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <div key={product._id} className="card group">
              <div className="relative aspect-square overflow-hidden bg-secondary-100">
                <Link to={`/products/${product._id}`}>
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>
                <button
                  onClick={() => handleRemove(product._id)}
                  className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4">
                <Link to={`/products/${product._id}`}>
                  <h3 className="font-semibold mb-2 line-clamp-1 hover:text-primary-600 transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-primary-600">
                    {mode === 'buy' ? (
                      <>₹{product.buyPrice?.toLocaleString()}</>
                    ) : (
                      <>₹{product.rentPrice}<span className="text-sm text-secondary-500 font-normal">/mo</span></>
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;

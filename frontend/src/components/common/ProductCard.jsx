import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Plus, Check } from 'lucide-react';
import useStore from '../../store/useStore';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const ProductCard = ({ product, featured = false, mode = 'rent' }) => {
  // Guard against undefined/null product
  if (!product) {
    return null;
  }

  const { user, isAuthenticated, addToCart, addToWishlist, removeFromWishlist, wishlist } = useStore();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(wishlist?.some(item => item._id === product._id) || false);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    setIsAddingToCart(true);
    try {
      addToCart(product, product.minRentalPeriod || 3, 1);
      toast.success(`${product.name} added to cart`);
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      return;
    }

    // Update locally first (optimistic UI)
    if (isWishlisted) {
      removeFromWishlist(product._id);
      setIsWishlisted(false);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product);
      setIsWishlisted(true);
      toast.success('Added to wishlist');
    }

    // Try API in background (non-blocking)
    try {
      if (isWishlisted) {
        api.delete(`/users/wishlist/${product._id}`).catch(() => {});
      } else {
        api.post('/users/wishlist', { productId: product._id }).catch(() => {});
      }
    } catch (e) {
      // Ignore API errors
    }
  };

  // Placeholder image for products without images
  const placeholderImage = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop';
  
  // Get first image or use placeholder
  const productImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : placeholderImage;

  return (
    <div className={`card group flex flex-col h-full overflow-hidden ${featured ? 'lg:col-span-1' : ''}`}>
      <div className="relative h-56 sm:h-64 overflow-hidden rounded-t-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <Link to={`/products/${product._id}`} className="block w-full h-full">
          <img
            src={productImage}
            alt={product.name}
            className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              e.target.src = placeholderImage;
            }}
          />
        </Link>
        
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-md ${
            isWishlisted 
              ? 'bg-red-500 text-white' 
              : 'bg-surface text-theme-secondary hover:bg-surface-elevated hover:text-red-500'
          }`}
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {product.isFeatured && (
          <span className="absolute top-3 left-3 bg-primary-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Featured
          </span>
        )}

        {product.securityDeposit === 0 && (
          <span className="absolute bottom-3 left-3 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            No Deposit
          </span>
        )}
        
        {/* Image Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-grow" style={{ backgroundColor: 'var(--surface)' }}>
        <Link to={`/products/${product._id}`} className="block mb-2">
          <h3 className="font-semibold text-base sm:text-lg line-clamp-2 hover:text-[var(--accent)] transition-colors min-h-[3rem]" style={{ color: 'var(--text-primary)' }}>
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mb-3">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{product.rating?.toFixed(1) || '0.0'}</span>
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>({product.numReviews || 0})</span>
        </div>

        <div className="flex items-end gap-2 mb-3">
          {mode === 'buy' ? (
            <>
              <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                ₹{(product?.buyPrice || 15000).toLocaleString()}
              </span>
            </>
          ) : (
            <>
              <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                ₹{product?.rentPrice || 499}
              </span>
              <span className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>/month</span>
            </>
          )}
        </div>

        {mode === 'rent' && product.securityDeposit > 0 && (
          <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
            Deposit: ₹{product.securityDeposit?.toLocaleString()}
          </p>
        )}

        <div className="mt-auto pt-3" style={{ borderTop: '1px solid var(--border)' }}>
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart || product.countInStock === 0}
            className={`w-full btn ${
              product.countInStock === 0 
                ? 'cursor-not-allowed' 
                : 'btn-primary'
            }`}
            style={product.countInStock === 0 ? { backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-muted)' } : {}}
          >
            {isAddingToCart ? (
              <Check className="w-5 h-5" />
            ) : product.countInStock === 0 ? (
              'Out of Stock'
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

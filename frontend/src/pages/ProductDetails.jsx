import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Share2, 
  Truck, 
  Shield, 
  RotateCcw, 
  Check, 
  ChevronRight,
  Star,
  Plus,
  Minus,
  ArrowLeft
} from 'lucide-react';
import api, { productApi } from '../utils/api';
import useStore from '../store/useStore';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isAuthenticated, user, addToWishlist, removeFromWishlist, wishlist } = useStore();
  
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [rentalDuration, setRentalDuration] = useState(3);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await productApi.getProductById(id);
        setProduct(res.data.product);
        setRentalDuration(res.data.product.minRentalPeriod || 3);
        setIsWishlisted(wishlist.includes(res.data.product._id));
      } catch (error) {
        toast.error('Failed to load product');
        navigate('/products');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate, wishlist]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    addToCart(product, rentalDuration, quantity);
    toast.success('Added to cart');
  };

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      return;
    }

    try {
      if (isWishlisted) {
        await api.delete(`/users/wishlist/${product._id}`);
        removeFromWishlist(product._id);
        setIsWishlisted(false);
        toast.success('Removed from wishlist');
      } else {
        await api.post('/users/wishlist', { productId: product._id });
        addToWishlist(product._id);
        setIsWishlisted(true);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };

  const totalMonthly = product ? product.monthlyRent * quantity : 0;
  const totalRent = totalMonthly * rentalDuration;
  const securityDeposit = product ? (product.securityDeposit || 0) * quantity : 0;

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (!product) return null;

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="container-custom">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-secondary-600 hover:text-primary-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-sm">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                      selectedImage === idx ? 'border-primary-600' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-sm text-primary-600 font-medium uppercase tracking-wide">
                  {product.category}
                </span>
                <h1 className="text-2xl lg:text-3xl font-bold mt-1">{product.name}</h1>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleToggleWishlist}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    isWishlisted ? 'bg-red-500 text-white' : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
                <button className="w-12 h-12 rounded-full bg-secondary-100 text-secondary-600 hover:bg-secondary-200 flex items-center justify-center">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="font-semibold">{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-secondary-400">|</span>
              <span className="text-secondary-600">{product.numReviews} Reviews</span>
              <span className="text-secondary-400">|</span>
              <span className={`${product.countInStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.countInStock > 0 ? `${product.countInStock} in stock` : 'Out of stock'}
              </span>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-bold text-secondary-900">
                  ₹{product.monthlyRent}
                </span>
                <span className="text-secondary-500">/month</span>
                {product.originalPrice > 0 && (
                  <span className="text-secondary-400 line-through ml-2">
                    Buy: ₹{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Rental Duration (months)</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setRentalDuration(Math.max(product.minRentalPeriod || 3, rentalDuration - 1))}
                      className="w-10 h-10 rounded-lg bg-secondary-100 flex items-center justify-center hover:bg-secondary-200"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-16 text-center font-semibold text-lg">{rentalDuration}</span>
                    <button
                      onClick={() => setRentalDuration(Math.min(product.maxRentalPeriod || 24, rentalDuration + 1))}
                      className="w-10 h-10 rounded-lg bg-secondary-100 flex items-center justify-center hover:bg-secondary-200"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <span className="text-secondary-500 text-sm">
                      ({product.minRentalPeriod || 3} - {product.maxRentalPeriod || 24} months)
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Quantity</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg bg-secondary-100 flex items-center justify-center hover:bg-secondary-200"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-16 text-center font-semibold text-lg">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.countInStock, quantity + 1))}
                      className="w-10 h-10 rounded-lg bg-secondary-100 flex items-center justify-center hover:bg-secondary-200"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t border-secondary-200 pt-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-secondary-600">Monthly Rent ({quantity} item{quantity > 1 ? 's' : ''})</span>
                  <span>₹{totalMonthly}/mo</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-secondary-600">Rental Period</span>
                  <span>{rentalDuration} months</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-secondary-600">Security Deposit (refundable)</span>
                  <span>₹{securityDeposit}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-secondary-200">
                  <span className="font-semibold">Total for {rentalDuration} months</span>
                  <span className="font-bold text-xl text-primary-600">₹{totalRent + securityDeposit}</span>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.countInStock === 0}
                className="w-full btn-primary py-4 text-lg"
              >
                {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-white rounded-lg">
                <Truck className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Free Delivery</p>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <Shield className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Quality Assured</p>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <RotateCcw className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Easy Returns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex border-b border-secondary-200">
            {['description', 'features', 'reviews'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-medium capitalize transition-colors ${
                  activeTab === tab 
                    ? 'text-primary-600 border-b-2 border-primary-600' 
                    : 'text-secondary-600 hover:text-secondary-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-secondary-700 leading-relaxed">{product.description}</p>
                {product.dimensions && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-2">Dimensions</h4>
                    <p className="text-secondary-600">
                      {product.dimensions.length} x {product.dimensions.width} x {product.dimensions.height} {product.dimensions.unit}
                    </p>
                  </div>
                )}
                {product.material && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Material</h4>
                    <p className="text-secondary-600">{product.material}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'features' && (
              <ul className="space-y-2">
                {product.features?.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>{feature}</span>
                  </li>
                )) || <p className="text-secondary-500">No features listed</p>}
              </ul>
            )}

            {activeTab === 'reviews' && (
              <div>
                {product.reviews?.length > 0 ? (
                  <div className="space-y-6">
                    {product.reviews.map(review => (
                      <div key={review._id} className="border-b border-secondary-200 pb-6 last:border-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                          <span className="text-sm text-secondary-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="font-medium mb-1">{review.user?.name || 'Anonymous'}</p>
                        <p className="text-secondary-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-secondary-500">No reviews yet</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

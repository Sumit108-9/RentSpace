import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, X, ChevronDown, Grid3X3, List } from 'lucide-react';
import { productApi } from '../utils/api';
import ProductCard from '../components/common/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [mode, setMode] = useState('rent');
  const [pagination, setPagination] = useState({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minRating: searchParams.get('minRating') || '',
    sort: searchParams.get('sort') || 'newest',
    page: parseInt(searchParams.get('page')) || 1
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await productApi.getCategories();
        setCategories(res.data.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.category) params.append('category', filters.category);
        if (filters.search) params.append('search', filters.search);
        if (filters.minPrice) {
          products = products.filter(p => (mode === 'buy' ? p.buyPrice : p.rentPrice) >= filters.minPrice);
        }
        if (filters.maxPrice) {
          products = products.filter(p => (mode === 'buy' ? p.buyPrice : p.rentPrice) <= filters.maxPrice);
        }
        if (filters.minRating) params.append('minRating', filters.minRating);
        if (filters.sort) params.append('sort', filters.sort);
        params.append('page', filters.page);

        const res = await productApi.getProducts({
          category: filters.category,
          search: filters.search,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          minRating: filters.minRating,
          sort: filters.sort,
          page: filters.page
        });
        setProducts(res.data.products);
        setPagination(res.data.pagination);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [filters]);

  const updateFilter = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      search: '',
      minPrice: '',
      maxPrice: '',
      minRating: '',
      sort: 'newest',
      page: 1
    });
    setSearchParams({});
  };

  const priceRanges = [
    { label: 'Under ₹500', min: 0, max: 500 },
    { label: '₹500 - ₹1000', min: 500, max: 1000 },
    { label: '₹1000 - ₹2000', min: 1000, max: 2000 },
    { label: 'Above ₹2000', min: 2000, max: '' }
  ];

  const ratingOptions = [
    { label: '4★ & above', value: 4 },
    { label: '3★ & above', value: 3 },
    { label: '2★ & above', value: 2 }
  ];

  const sortOptions = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Price: Low to High', value: 'price_low' },
    { label: 'Price: High to Low', value: 'price_high' },
    { label: 'Highest Rated', value: 'rating' }
  ];

  const FilterSection = ({ title, children }) => (
    <div className="mb-6">
      <h4 className="font-semibold mb-3 text-theme-primary">{title}</h4>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-theme-secondary">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-theme-primary">
            {filters.category ? filters.category.charAt(0).toUpperCase() + filters.category.slice(1) : 'All Products'}
          </h1>
          <p className="text-theme-muted">
            {pagination.total || 0} products available
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className={`lg:w-64 flex-shrink-0 ${showMobileFilters ? 'fixed inset-0 z-50 bg-surface p-4 overflow-auto lg:static lg:p-0' : 'hidden lg:block'}`}>
            {showMobileFilters && (
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <h2 className="text-xl font-bold text-theme-primary">Filters</h2>
                <button onClick={() => setShowMobileFilters(false)} className="text-theme-secondary">
                  <X className="w-6 h-6" />
                </button>
              </div>
            )}

            <div className="bg-surface rounded-xl p-6 shadow-sm border border-theme">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-theme-primary">Filters</h3>
                {(filters.category || filters.minPrice || filters.minRating) && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-accent hover:text-accent-hover"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <FilterSection title="Categories">
                <div className="space-y-2">
                  {categories.map(cat => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        checked={filters.category === cat}
                        onChange={() => updateFilter('category', cat)}
                        className="filter-radio hidden"
                      />
                      <span className="filter-label w-full justify-start capitalize text-sm">
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="Price Range">
                <div className="space-y-2">
                  {priceRanges.map(range => (
                    <label key={range.label} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="price"
                        checked={filters.minPrice === String(range.min) && filters.maxPrice === String(range.max)}
                        onChange={() => {
                          updateFilter('minPrice', range.min);
                          updateFilter('maxPrice', range.max);
                        }}
                        className="filter-radio hidden"
                      />
                      <span className="filter-label w-full justify-start text-sm">
                        {range.label}
                      </span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="Rating">
                <div className="space-y-2">
                  {ratingOptions.map(option => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="rating"
                        checked={filters.minRating === String(option.value)}
                        onChange={() => updateFilter('minRating', option.value)}
                        className="filter-radio hidden"
                      />
                      <span className="filter-label w-full justify-start text-sm">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </FilterSection>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-surface rounded-xl p-4 mb-6 shadow-sm border border-theme flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border border-theme rounded-lg text-theme-secondary hover:border-accent hover:text-accent transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>

                {/* Buy/Rent Mode Toggle */}
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

                <div className="hidden sm:flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400' : 'text-theme-muted hover:text-theme-secondary'}`}
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400' : 'text-theme-muted hover:text-theme-secondary'}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-theme-muted text-sm hidden sm:inline">Sort by:</span>
                <select
                  value={filters.sort}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                  className="input text-sm py-2 px-3"
                >
                  {sortOptions.map(opt => (
                    <option key={opt.value} value={opt.value} className="bg-surface text-theme-primary">{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <LoadingSpinner />
            ) : products.length === 0 ? (
              <div className="text-center py-16 bg-surface rounded-xl border border-theme">
                <p className="text-theme-muted text-lg">No products found</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-accent hover:text-accent-hover"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                  {products.map((product, index) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ProductCard product={product} mode={mode} />
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => updateFilter('page', filters.page - 1)}
                      disabled={filters.page === 1}
                      className="px-4 py-2 border border-theme rounded-lg text-theme-secondary hover:border-accent hover:text-accent disabled:opacity-50 disabled:hover:border-theme disabled:hover:text-theme-secondary transition-colors"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 text-theme-primary">
                      Page {filters.page} of {pagination.pages}
                    </span>
                    <button
                      onClick={() => updateFilter('page', filters.page + 1)}
                      disabled={!pagination.hasMore}
                      className="px-4 py-2 border border-theme rounded-lg text-theme-secondary hover:border-accent hover:text-accent disabled:opacity-50 disabled:hover:border-theme disabled:hover:text-theme-secondary transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;

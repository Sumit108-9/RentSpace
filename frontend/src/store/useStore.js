import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../utils/api';

let setRehydratedFn = null;

const useStore = create(
  persist(
    (set, get) => ({
      // Auth State
      user: null,
      token: null,
      isAuthenticated: false,
      hasRehydrated: false,
      
      setAuth: (user, token) => set({
        user,
        token,
        isAuthenticated: true
      }),
      
      logout: () => {
        // Clear all storage keys that might contain user data
        localStorage.removeItem('token');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('userOrders');
        localStorage.removeItem('rentalSearch');
        localStorage.removeItem('customizationDrafts');
        
        // Reset state completely
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          // Keep userCarts/userWishlists but they won't be accessible without user
        });
      },

      setHasRehydrated: () => set({ hasRehydrated: true }),
      
      updateUser: (userData) => set((state) => ({
        user: { ...state.user, ...userData }
      })),

      // Cart State - user-specific (keyed by userId)
      userCarts: {},
      
      // Get current user's cart
      getUserCart: () => {
        const { userCarts, user } = get();
        const userId = user?.id || user?._id;
        if (!userId) return [];
        return userCarts[userId] || [];
      },
      
      // Add item to cart with unique ID for stable React keys
      // BUG FIX: Changed default rentalDuration from 3 to 1 month
      addToCart: (product, rentalDuration = 1, quantity = 1) => set((state) => {
        const userId = state.user?.id || state.user?._id;
        if (!userId) return state;
        
        const productId = String(product._id || product.id);
        const currentCart = state.userCarts[userId] || [];
        
        const existingItem = currentCart.find(item => {
          const itemProductId = String(item.product?._id || item.product?.id);
          return itemProductId === productId && item.rentalDuration === rentalDuration;
        });
        
        let newCart;
        if (existingItem) {
          newCart = currentCart.map(item => {
            const itemProductId = String(item.product?._id || item.product?.id);
            return itemProductId === productId && item.rentalDuration === rentalDuration
              ? { ...item, quantity: item.quantity + quantity }
              : item;
          });
        } else {
          newCart = [...currentCart, { 
            cartItemId: `${productId}-${Date.now()}`,
            product, 
            rentalDuration, 
            quantity 
          }];
        }
        
        return {
          userCarts: { ...state.userCarts, [userId]: newCart }
        };
      }),
      
      removeFromCart: (productId, rentalDuration) => set((state) => {
        const userId = state.user?.id || state.user?._id;
        if (!userId) return state;
        
        // Normalize productId to string
        const normalizedProductId = String(productId);
        
        const currentCart = state.userCarts[userId] || [];
        return {
          userCarts: {
            ...state.userCarts,
            [userId]: currentCart.filter(item => {
              const itemProductId = String(item.product?._id || item.product?.id);
              return !(itemProductId === normalizedProductId && item.rentalDuration === rentalDuration);
            })
          }
        };
      }),
      
      updateCartItemQuantity: (productId, rentalDuration, quantity) => set((state) => {
        const userId = state.user?.id || state.user?._id;
        if (!userId) return state;
        
        // Normalize productId to string
        const normalizedProductId = String(productId);
        
        const currentCart = state.userCarts[userId] || [];
        return {
          userCarts: {
            ...state.userCarts,
            [userId]: currentCart.map(item => {
              const itemProductId = String(item.product?._id || item.product?.id);
              return itemProductId === normalizedProductId && item.rentalDuration === rentalDuration
                ? { ...item, quantity }
                : item;
            })
          }
        };
      }),
      
      // Update rental duration for a cart item
      // BUG FIX: Uses cartItemId for precise targeting instead of productId+oldDuration
      // This ensures the correct item is updated even if multiple items have same product
      updateCartItemDuration: (cartItemId, newDuration) => set((state) => {
        const userId = state.user?.id || state.user?._id;
        if (!userId) return state;
        
        const currentCart = state.userCarts[userId] || [];
        
        // Check if another cart item already has this product + new duration combination
        const targetItem = currentCart.find(item => item.cartItemId === cartItemId);
        if (!targetItem) return state; // Item not found
        
        const { product } = targetItem;
        const existingItem = currentCart.find(
          item => item.product._id === product._id 
            && item.rentalDuration === newDuration 
            && item.cartItemId !== cartItemId
        );
        
        let newCart;
        if (existingItem) {
          // Merge: remove the updated item and add quantity to existing item
          newCart = currentCart
            .filter(item => item.cartItemId !== cartItemId) // Remove the item being updated
            .map(item =>
              item.cartItemId === existingItem.cartItemId
                ? { ...item, quantity: item.quantity + targetItem.quantity }
                : item
            );
        } else {
          // Just update the duration of the specific item
          newCart = currentCart.map(item =>
            item.cartItemId === cartItemId
              ? { ...item, rentalDuration: newDuration }
              : item
          );
        }
        
        return {
          userCarts: { ...state.userCarts, [userId]: newCart }
        };
      }),
      
      clearCart: () => set((state) => {
        const userId = state.user?.id || state.user?._id;
        if (!userId) return state;
        return {
          userCarts: { ...state.userCarts, [userId]: [] }
        };
      }),
      
      getCartTotal: () => {
        const { userCarts, user } = get();
        const userId = user?.id || user?._id;
        const cart = userId ? (userCarts[userId] || []) : [];
        return cart.reduce((total, item) => {
          return total + ((item.product?.monthlyRent || 0) * (item.rentalDuration || 1) * (item.quantity || 1));
        }, 0);
      },

      getCartCount: () => {
        const { userCarts, user } = get();
        const userId = user?.id || user?._id;
        const cart = userId ? (userCarts[userId] || []) : [];
        return cart.reduce((count, item) => count + item.quantity, 0);
      },

      // Wishlist State
      userWishlists: {},
      
      // Get current user's wishlist
      getUserWishlist: () => {
        const { userWishlists, user } = get();
        const userId = user?.id || user?._id;
        if (!userId) return [];
        return userWishlists[userId] || [];
      },
      
      addToWishlist: (product) => set((state) => {
        const userId = state.user?.id || state.user?._id;
        if (!userId) return state;
        
        const currentWishlist = state.userWishlists[userId] || [];
        const productId = String(product._id || product.id);
        const exists = currentWishlist.find(item => String(item._id || item.id) === productId);
        if (exists) return state;
        
        return {
          userWishlists: {
            ...state.userWishlists,
            [userId]: [product, ...currentWishlist]
          }
        };
      }),
      
      removeFromWishlist: (productId) => set((state) => {
        const userId = state.user?.id || state.user?._id;
        if (!userId) return state;
        
        const normalizedProductId = String(productId);
        const currentWishlist = state.userWishlists[userId] || [];
        return {
          userWishlists: {
            ...state.userWishlists,
            [userId]: currentWishlist.filter(item => String(item._id || item.id) !== normalizedProductId)
          }
        };
      }),

      // Product State - fetched from API, NOT persisted
      products: [],
      featuredProducts: [],
      selectedProduct: null,
      productPagination: { page: 1, limit: 12, total: 0, pages: 0, hasMore: false },
      productFilters: { category: '', search: '', sort: '', minPrice: '', maxPrice: '' },
      productsLoading: false,
      productError: null,

      setProductFilters: (filters) => set((state) => ({
        productFilters: { ...state.productFilters, ...filters },
        productPagination: { ...state.productPagination, page: 1 }
      })),

      resetProductFilters: () => set({
        productFilters: { category: '', search: '', sort: '', minPrice: '', maxPrice: '' },
        productPagination: { ...get().productPagination, page: 1 }
      }),

      fetchProducts: async (page = 1, limit = 12) => {
        set({ productsLoading: true, productError: null });
        try {
          const { productFilters } = get();
          const params = new URLSearchParams();
          params.set('page', page);
          params.set('limit', limit);
          if (productFilters.category) params.set('category', productFilters.category);
          if (productFilters.search) params.set('search', productFilters.search);
          if (productFilters.sort) params.set('sort', productFilters.sort);
          if (productFilters.minPrice) params.set('minPrice', productFilters.minPrice);
          if (productFilters.maxPrice) params.set('maxPrice', productFilters.maxPrice);

          const cacheKey = `/api/products?${params}`;
          
          // Check cache first
          const cached = localStorage.getItem(`rentspace_cache_${cacheKey}`);
          if (cached) {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < 5 * 60 * 1000) { // 5 min cache
              set({
                products: data.products,
                productPagination: data.pagination,
                productsLoading: false
              });
              return;
            }
          }

          const response = await api.get(`/products?${params}`);
          const data = response.data;

          if (data.success) {
            // Cache the response
            localStorage.setItem(`rentspace_cache_${cacheKey}`, JSON.stringify({
              data: { products: data.products, pagination: data.pagination },
              timestamp: Date.now()
            }));
            
            set({
              products: data.products,
              productPagination: data.pagination,
              productsLoading: false
            });
          } else {
            set({ productError: data.message || 'Failed to fetch products', productsLoading: false });
          }
        } catch (error) {
          set({ productError: error.message, productsLoading: false });
        }
      },

      fetchFeaturedProducts: async () => {
        try {
          // Check cache first
          const cached = localStorage.getItem('rentspace_cache_/api/products/featured');
          if (cached) {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < 10 * 60 * 1000) { // 10 min cache
              set({ featuredProducts: data });
              return;
            }
          }

          const response = await api.get('/products/featured');
          const data = response.data;
          if (data.success) {
            // Cache the response
            localStorage.setItem('rentspace_cache_/api/products/featured', JSON.stringify({
              data: data.products,
              timestamp: Date.now()
            }));
            set({ featuredProducts: data.products });
          }
        } catch (error) {
          console.error('Failed to fetch featured products:', error);
        }
      },

      fetchProductById: async (id) => {
        set({ productsLoading: true, productError: null, selectedProduct: null });
        try {
          // Check cache first
          const cached = localStorage.getItem(`rentspace_cache_/api/products/${id}`);
          if (cached) {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < 15 * 60 * 1000) { // 15 min cache
              set({ selectedProduct: data, productsLoading: false });
              return;
            }
          }

          const response = await api.get(`/products/${id}`);
          const data = response.data;
          if (data.success) {
            // Cache the response
            localStorage.setItem(`rentspace_cache_/api/products/${id}`, JSON.stringify({
              data: data.product,
              timestamp: Date.now()
            }));
            set({ selectedProduct: data.product, productsLoading: false });
          } else {
            set({ productError: data.message || 'Product not found', productsLoading: false });
          }
        } catch (error) {
          set({ productError: error.message, productsLoading: false });
        }
      },

      clearSelectedProduct: () => set({ selectedProduct: null, productError: null }),

      // Orders State - NOT persisted, always fetch from API
      // No local orders storage - each user gets fresh data from server
    }),
    {
      name: 'rentspace-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        userCarts: state.userCarts,
        userWishlists: state.userWishlists
        // Note: orders are NOT persisted - fetched fresh per user from API
      }),
      onRehydrateStorage: (state) => {
        // This runs after rehydration completes
        return () => {
          useStore.getState().setHasRehydrated();
        };
      },
      skipHydration: false
    }
  )
);

export default useStore;

// Migration: Clear old shared cart/wishlist data (v1 -> v2)
// This ensures each user has isolated cart/wishlist data
const STORAGE_KEY = 'rentspace-storage';
try {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const data = JSON.parse(stored);
    // Check if old format (cart/wishlist as arrays) exists
    if (data.state && (data.state.cart || data.state.wishlist || data.state.orders)) {
      delete data.state.cart;
      delete data.state.wishlist;
      delete data.state.orders;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }
} catch (e) {
  console.error('Migration error:', e);
}

// Set up the rehydration callback after store creation
setRehydratedFn = () => useStore.getState().setHasRehydrated();

// SAFETY: Force hasRehydrated after 3 seconds if callback doesn't fire
setTimeout(() => {
  const state = useStore.getState();
  if (!state.hasRehydrated) {
    state.setHasRehydrated();
  }
}, 3000);

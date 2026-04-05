import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
      
      logout: () => set({
        user: null,
        token: null,
        isAuthenticated: false
      }),

      setHasRehydrated: () => set({ hasRehydrated: true }),
      
      updateUser: (userData) => set((state) => ({
        user: { ...state.user, ...userData }
      })),

      // Cart State
      cart: [],
      
      addToCart: (product, rentalDuration = 3, quantity = 1) => set((state) => {
        const existingItem = state.cart.find(
          item => item.product._id === product._id && item.rentalDuration === rentalDuration
        );
        
        if (existingItem) {
          return {
            cart: state.cart.map(item =>
              item.product._id === product._id && item.rentalDuration === rentalDuration
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          };
        }
        
        return {
          cart: [...state.cart, { product, rentalDuration, quantity }]
        };
      }),
      
      removeFromCart: (productId, rentalDuration) => set((state) => ({
        cart: state.cart.filter(
          item => !(item.product._id === productId && item.rentalDuration === rentalDuration)
        )
      })),
      
      updateCartItemQuantity: (productId, rentalDuration, quantity) => set((state) => ({
        cart: state.cart.map(item =>
          item.product._id === productId && item.rentalDuration === rentalDuration
            ? { ...item, quantity }
            : item
        )
      })),
      
      updateCartItemDuration: (productId, oldDuration, newDuration) => set((state) => {
        const existingItem = state.cart.find(
          item => item.product._id === productId && item.rentalDuration === newDuration
        );
        
        if (existingItem) {
          return {
            cart: state.cart
              .filter(item => !(item.product._id === productId && item.rentalDuration === oldDuration))
              .map(item =>
                item.product._id === productId && item.rentalDuration === newDuration
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              )
          };
        }
        
        return {
          cart: state.cart.map(item =>
            item.product._id === productId && item.rentalDuration === oldDuration
              ? { ...item, rentalDuration: newDuration }
              : item
          )
        };
      }),
      
      clearCart: () => set({ cart: [] }),
      
      getCartTotal: () => {
        const { cart } = get();
        return cart.reduce((total, item) => {
          return total + (item.product.monthlyRent * item.rentalDuration * item.quantity);
        }, 0);
      },
      
      getSecurityDeposit: () => {
        const { cart } = get();
        return cart.reduce((total, item) => {
          return total + ((item.product.securityDeposit || 0) * item.quantity);
        }, 0);
      },
      
      getCartCount: () => {
        const { cart } = get();
        return cart.reduce((count, item) => count + item.quantity, 0);
      },

      // Wishlist State
      wishlist: [],
      
      setWishlist: (wishlist) => set({ wishlist }),
      
      addToWishlist: (product) => set((state) => {
        // Avoid duplicates
        const exists = state.wishlist.find(item => item._id === product._id);
        if (exists) return { wishlist: state.wishlist };
        return { wishlist: [product, ...state.wishlist] };
      }),
      
      removeFromWishlist: (productId) => set((state) => ({
        wishlist: state.wishlist.filter(item => item._id !== productId)
      })),

      // Orders State
      orders: [],
      
      addOrder: (order) => set((state) => ({
        orders: [order, ...state.orders]
      })),
      
      updateOrder: (orderId, updates) => set((state) => ({
        orders: state.orders.map(o => o._id === orderId ? { ...o, ...updates } : o)
      })),
      
      getOrderById: (orderId) => {
        const { orders } = get();
        return orders.find(o => o._id === orderId);
      },
    }),
    {
      name: 'rentspace-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        cart: state.cart,
        wishlist: state.wishlist,
        orders: state.orders
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

// Set up the rehydration callback after store creation
setRehydratedFn = () => useStore.getState().setHasRehydrated();

// SAFETY: Force hasRehydrated after 3 seconds if callback doesn't fire
setTimeout(() => {
  const state = useStore.getState();
  if (!state.hasRehydrated) {
    console.log('Store safety: forcing hasRehydrated');
    state.setHasRehydrated();
  }
}, 3000);

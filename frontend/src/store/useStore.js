import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set, get) => ({
      // Auth State
      user: null,
      token: null,
      isAuthenticated: false,
      
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
      
      addToWishlist: (productId) => set((state) => ({
        wishlist: [...state.wishlist, productId]
      })),
      
      removeFromWishlist: (productId) => set((state) => ({
        wishlist: state.wishlist.filter(id => id !== productId)
      })),

      // UI State
      isLoading: false,
      setIsLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'rentspace-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        cart: state.cart,
        wishlist: state.wishlist
      })
    }
  )
);

export default useStore;

import { create } from 'zustand';

// Cart Store
export const useCartStore = create((set, get) => ({
  items: JSON.parse(localStorage.getItem('cart')) || [],
  
  addToCart: (product, quantity = 1) => {
    set((state) => {
      const existing = state.items.find(item => item.id === product.id);
      let newItems;
      
      if (existing) {
        newItems = state.items.map(item =>
          item.id === product.id
            ? { ...item, ...product, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...state.items, { ...product, quantity }];
      }
      
      localStorage.setItem('cart', JSON.stringify(newItems));
      return { items: newItems };
    });
  },
  
  removeFromCart: (productId) => {
    set((state) => {
      const newItems = state.items.filter(item => item.id !== productId);
      localStorage.setItem('cart', JSON.stringify(newItems));
      return { items: newItems };
    });
  },
  
  updateQuantity: (productId, quantity) => {
    set((state) => {
      if (quantity <= 0) {
        return get().removeFromCart(productId);
      }
      
      const newItems = state.items.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );
      
      localStorage.setItem('cart', JSON.stringify(newItems));
      return { items: newItems };
    });
  },
  
  clearCart: () => {
    localStorage.removeItem('cart');
    set({ items: [] });
  },
  
  getCartTotal: () => {
    return get().items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },
  
  getCartCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },
}));

// Wishlist Store
export const useWishlistStore = create((set, get) => ({
  items: JSON.parse(localStorage.getItem('wishlist')) || [],
  
  addToWishlist: (product) => {
    set((state) => {
      const exists = state.items.find(item => item.id === product.id);
      if (exists) return state;
      
      const newItems = [...state.items, product];
      localStorage.setItem('wishlist', JSON.stringify(newItems));
      return { items: newItems };
    });
  },
  
  removeFromWishlist: (productId) => {
    set((state) => {
      const newItems = state.items.filter(item => item.id !== productId);
      localStorage.setItem('wishlist', JSON.stringify(newItems));
      return { items: newItems };
    });
  },
  
  isInWishlist: (productId) => {
    return get().items.some(item => item.id === productId);
  },
  
  clearWishlist: () => {
    localStorage.removeItem('wishlist');
    set({ items: [] });
  },
}));

// Auth Store
export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('auth_user')) || null,
  isLoggedIn: !!localStorage.getItem('auth_user'),
  
  login: (user) => {
    localStorage.setItem('auth_user', JSON.stringify(user));
    set({ user, isLoggedIn: true });
  },
  
  logout: () => {
    localStorage.removeItem('auth_user');
    set({ user: null, isLoggedIn: false });
  },
  
  updateProfile: (userData) => {
    const updatedUser = { ...get().user, ...userData };
    localStorage.setItem('auth_user', JSON.stringify(updatedUser));
    set({ user: updatedUser });
  },
}));

// Preferences Store
export const usePreferencesStore = create((set) => ({
  savedAddresses: JSON.parse(localStorage.getItem('saved_addresses')) || [],
  selectedAddress: JSON.parse(localStorage.getItem('selected_address')) || null,
  appliedCoupon: JSON.parse(localStorage.getItem('applied_coupon')) || null,
  
  addAddress: (address) => {
    set((state) => {
      const newAddresses = [...state.savedAddresses, { ...address, id: Date.now() }];
      localStorage.setItem('saved_addresses', JSON.stringify(newAddresses));
      return { savedAddresses: newAddresses };
    });
  },
  
  updateAddress: (id, address) => {
    set((state) => {
      const newAddresses = state.savedAddresses.map(addr =>
        addr.id === id ? { ...addr, ...address } : addr
      );
      localStorage.setItem('saved_addresses', JSON.stringify(newAddresses));
      return { savedAddresses: newAddresses };
    });
  },
  
  deleteAddress: (id) => {
    set((state) => {
      const newAddresses = state.savedAddresses.filter(addr => addr.id !== id);
      localStorage.setItem('saved_addresses', JSON.stringify(newAddresses));
      return { savedAddresses: newAddresses };
    });
  },
  
  setSelectedAddress: (address) => {
    localStorage.setItem('selected_address', JSON.stringify(address));
    set({ selectedAddress: address });
  },
  
  applyCoupon: (coupon) => {
    localStorage.setItem('applied_coupon', JSON.stringify(coupon));
    set({ appliedCoupon: coupon });
  },
  
  removeCoupon: () => {
    localStorage.removeItem('applied_coupon');
    set({ appliedCoupon: null });
  },
}));

// Orders Store
export const useOrdersStore = create((set, get) => ({
  orders: JSON.parse(localStorage.getItem('orders')) || [],
  
  createOrder: (orderData) => {
    set((state) => {
      const newOrder = {
        ...orderData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        status: 'Order Placed',
      };
      const newOrders = [newOrder, ...state.orders];
      localStorage.setItem('orders', JSON.stringify(newOrders));
      return { orders: newOrders };
    });
  },
  
  updateOrder: (id, data) => {
    set((state) => {
      const newOrders = state.orders.map(order =>
        order.id === id ? { ...order, ...data } : order
      );
      localStorage.setItem('orders', JSON.stringify(newOrders));
      return { orders: newOrders };
    });
  },
  
  getOrderById: (id) => {
    return get().orders.find(order => order.id === parseInt(id));
  },
}));

// Prescriptions Store
export const usePrescriptionsStore = create((set) => ({
  prescriptions: JSON.parse(localStorage.getItem('prescriptions')) || [],
  
  uploadPrescription: (prescription) => {
    set((state) => {
      const newPrescription = {
        ...prescription,
        id: Date.now(),
        uploadedAt: new Date().toISOString(),
        status: 'Under Review',
      };
      const newPrescriptions = [newPrescription, ...state.prescriptions];
      localStorage.setItem('prescriptions', JSON.stringify(newPrescriptions));
      return { prescriptions: newPrescriptions };
    });
  },
  
  updatePrescriptionStatus: (id, status) => {
    set((state) => {
      const newPrescriptions = state.prescriptions.map(p =>
        p.id === id ? { ...p, status } : p
      );
      localStorage.setItem('prescriptions', JSON.stringify(newPrescriptions));
      return { prescriptions: newPrescriptions };
    });
  },
}));

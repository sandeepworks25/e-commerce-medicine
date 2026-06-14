import { create } from "zustand";
import { clearStoredLocationLabel } from "../utils/location.js";
import {
  addressesApi,
  authApi,
  cartApi,
  ordersApi,
  prescriptionsApi,
  wishlistApi,
} from "../api/index.js";

const isAuthed = () => authApi.isAuthenticated();
const pid = (p) => p._id || p.id;

// Backend user uses fullName/phone; expose name/mobile aliases for components.
const withAliases = (u) =>
  u ? { ...u, name: u.fullName || u.name || '', mobile: u.phone || u.mobile || '' } : u;

// Cart Store — backend-backed when logged in, localStorage for guests.
export const useCartStore = create((set, get) => ({
  items: JSON.parse(localStorage.getItem("cart")) || [],

  // Load cart from backend (after login) or localStorage.
  hydrate: async () => {
    if (!isAuthed()) {
      set({ items: JSON.parse(localStorage.getItem("cart")) || [] });
      return;
    }
    try {
      // Push any guest items to the server first, then load merged cart.
      const guest = JSON.parse(localStorage.getItem("cart")) || [];
      for (const it of guest) {
        await cartApi.add(pid(it), it.quantity || 1);
      }
      localStorage.removeItem("cart");
      set({ items: await cartApi.get() });
    } catch {
      /* keep current */
    }
  },

  addToCart: async (product, quantity = 1) => {
    if (isAuthed()) {
      try {
        set({ items: await cartApi.add(pid(product), quantity) });
        return;
      } catch {
        /* fall through to local */
      }
    }
    set((state) => {
      const existing = state.items.find((item) => pid(item) === pid(product));
      const newItems = existing
        ? state.items.map((item) =>
            pid(item) === pid(product)
              ? { ...item, ...product, quantity: item.quantity + quantity }
              : item,
          )
        : [...state.items, { ...product, quantity }];
      localStorage.setItem("cart", JSON.stringify(newItems));
      return { items: newItems };
    });
  },

  removeFromCart: async (productId) => {
    if (isAuthed()) {
      try {
        set({ items: await cartApi.remove(productId) });
        return;
      } catch {
        /* fall through */
      }
    }
    set((state) => {
      const newItems = state.items.filter((item) => pid(item) !== productId);
      localStorage.setItem("cart", JSON.stringify(newItems));
      return { items: newItems };
    });
  },

  updateQuantity: async (productId, quantity) => {
    if (quantity <= 0) return get().removeFromCart(productId);
    if (isAuthed()) {
      try {
        set({ items: await cartApi.update(productId, quantity) });
        return;
      } catch {
        /* fall through */
      }
    }
    set((state) => {
      const newItems = state.items.map((item) =>
        pid(item) === productId ? { ...item, quantity } : item,
      );
      localStorage.setItem("cart", JSON.stringify(newItems));
      return { items: newItems };
    });
  },

  clearCart: async () => {
    if (isAuthed()) {
      try {
        await cartApi.clear();
      } catch {
        /* ignore */
      }
    }
    localStorage.removeItem("cart");
    set({ items: [] });
  },

  getCartTotal: () =>
    get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  getCartCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
}));

// Wishlist Store
export const useWishlistStore = create((set, get) => ({
  items: JSON.parse(localStorage.getItem("wishlist")) || [],

  hydrate: async () => {
    if (!isAuthed()) {
      set({ items: JSON.parse(localStorage.getItem("wishlist")) || [] });
      return;
    }
    try {
      const guest = JSON.parse(localStorage.getItem("wishlist")) || [];
      for (const it of guest) {
        await wishlistApi.add(pid(it));
      }
      localStorage.removeItem("wishlist");
      set({ items: await wishlistApi.get() });
    } catch {
      /* keep current */
    }
  },

  addToWishlist: async (product) => {
    if (isAuthed()) {
      try {
        set({ items: await wishlistApi.add(pid(product)) });
        return;
      } catch {
        /* fall through */
      }
    }
    set((state) => {
      if (state.items.find((item) => pid(item) === pid(product))) return state;
      const newItems = [...state.items, product];
      localStorage.setItem("wishlist", JSON.stringify(newItems));
      return { items: newItems };
    });
  },

  removeFromWishlist: async (productId) => {
    if (isAuthed()) {
      try {
        set({ items: await wishlistApi.remove(productId) });
        return;
      } catch {
        /* fall through */
      }
    }
    set((state) => {
      const newItems = state.items.filter((item) => pid(item) !== productId);
      localStorage.setItem("wishlist", JSON.stringify(newItems));
      return { items: newItems };
    });
  },

  isInWishlist: (productId) =>
    get().items.some((item) => pid(item) === productId),

  clearWishlist: () => {
    localStorage.removeItem("wishlist");
    set({ items: [] });
  },
}));

// Auth Store — real JWT.
export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("auth_user")) || null,
  isLoggedIn: authApi.isAuthenticated(),
  loading: false,

  login: async (login, password) => {
    const data = await authApi.login(login, password);
    const user = withAliases(data.user);
    localStorage.setItem("auth_user", JSON.stringify(user));
    set({ user, isLoggedIn: true });
    await useCartStore.getState().hydrate();
    await useWishlistStore.getState().hydrate();
    return user;
  },

  register: async (payload) => {
    const data = await authApi.register(payload);
    const user = withAliases(data.user);
    localStorage.setItem("auth_user", JSON.stringify(user));
    set({ user, isLoggedIn: true });
    await useCartStore.getState().hydrate();
    await useWishlistStore.getState().hydrate();
    return user;
  },

  // Re-validate token + refresh user on app load.
  fetchMe: async () => {
    if (!authApi.isAuthenticated()) return;
    try {
      const user = withAliases(await authApi.me());
      localStorage.setItem("auth_user", JSON.stringify(user));
      set({ user, isLoggedIn: true });
      await useCartStore.getState().hydrate();
      await useWishlistStore.getState().hydrate();
    } catch {
      authApi.logout();
      localStorage.removeItem("auth_user");
      set({ user: null, isLoggedIn: false });
    }
  },

  logout: () => {
    authApi.logout();
    localStorage.removeItem("auth_user");
    localStorage.removeItem("selected_address");
    clearStoredLocationLabel();
    set({ user: null, isLoggedIn: false });
    useCartStore.setState({ items: [] });
    useWishlistStore.setState({ items: [] });
  },

  updateProfile: (userData) =>
    set((state) => {
      const updatedUser = { ...state.user, ...userData };
      localStorage.setItem("auth_user", JSON.stringify(updatedUser));
      return { user: updatedUser };
    }),
}));

// Preferences Store — addresses backend-backed when logged in.
export const usePreferencesStore = create((set, get) => ({
  savedAddresses: JSON.parse(localStorage.getItem("saved_addresses")) || [],
  selectedAddress: JSON.parse(localStorage.getItem("selected_address")) || null,
  appliedCoupon: JSON.parse(localStorage.getItem("applied_coupon")) || null,

  hydrateAddresses: async () => {
    if (!isAuthed()) return;
    try {
      const list = await addressesApi.list();
      set({ savedAddresses: list.map((a) => ({ ...a, id: a._id })) });
    } catch {
      /* keep local */
    }
  },

  addAddress: async (address) => {
    if (isAuthed()) {
      try {
        const list = await addressesApi.add(address);
        set({ savedAddresses: list.map((a) => ({ ...a, id: a._id })) });
        return;
      } catch {
        /* fall through */
      }
    }
    set((state) => {
      const newAddresses = [
        ...state.savedAddresses,
        { ...address, id: Date.now() },
      ];
      localStorage.setItem("saved_addresses", JSON.stringify(newAddresses));
      return { savedAddresses: newAddresses };
    });
  },

  updateAddress: async (id, address) => {
    if (isAuthed()) {
      try {
        const list = await addressesApi.update(id, address);
        set({ savedAddresses: list.map((a) => ({ ...a, id: a._id })) });
        return;
      } catch {
        /* fall through */
      }
    }
    set((state) => {
      const newAddresses = state.savedAddresses.map((addr) =>
        addr.id === id ? { ...addr, ...address } : addr,
      );
      localStorage.setItem("saved_addresses", JSON.stringify(newAddresses));
      return { savedAddresses: newAddresses };
    });
  },

  deleteAddress: async (id) => {
    if (isAuthed()) {
      try {
        const list = await addressesApi.remove(id);
        set({ savedAddresses: list.map((a) => ({ ...a, id: a._id })) });
        return;
      } catch {
        /* fall through */
      }
    }
    set((state) => {
      const newAddresses = state.savedAddresses.filter(
        (addr) => addr.id !== id,
      );
      localStorage.setItem("saved_addresses", JSON.stringify(newAddresses));
      return { savedAddresses: newAddresses };
    });
  },

  setSelectedAddress: (address) => {
    localStorage.setItem("selected_address", JSON.stringify(address));
    set({ selectedAddress: address });
  },

  applyCoupon: (coupon) => {
    localStorage.setItem("applied_coupon", JSON.stringify(coupon));
    set({ appliedCoupon: coupon });
  },

  removeCoupon: () => {
    localStorage.removeItem("applied_coupon");
    set({ appliedCoupon: null });
  },

  // expose for components
  _get: get,
}));

// Orders Store — backend-backed.
export const useOrdersStore = create((set, get) => ({
  orders: [],

  fetchOrders: async () => {
    if (!isAuthed()) return;
    try {
      set({ orders: await ordersApi.list() });
    } catch {
      /* ignore */
    }
  },

  createOrder: async (orderData) => {
    const order = await ordersApi.create(orderData);
    set((state) => ({ orders: [order, ...state.orders] }));
    return order;
  },

  getOrderById: (id) =>
    get().orders.find((order) => (order._id || order.id) === id),
}));

// Prescriptions Store — backend-backed.
export const usePrescriptionsStore = create((set) => ({
  prescriptions: [],

  fetchPrescriptions: async () => {
    if (!isAuthed()) return;
    try {
      set({ prescriptions: await prescriptionsApi.list() });
    } catch {
      /* ignore */
    }
  },

  uploadPrescription: async ({ file, notes } = {}) => {
    const created = await prescriptionsApi.upload(file, notes);
    set((state) => ({ prescriptions: [created, ...state.prescriptions] }));
    return created;
  },
}));

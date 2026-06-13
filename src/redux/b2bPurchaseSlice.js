import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEYS = {
  cart: 'b2b_purchase_cart',
  orders: 'b2b_purchase_orders',
};

const loadStored = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;

  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

const initialState = {
  cart: loadStored(STORAGE_KEYS.cart, []),
  orders: loadStored(STORAGE_KEYS.orders, []),
  selectedBusinessId: '',
};

export const getB2BUnitPrice = (product) => Math.max(Math.round(product.price * 0.82), 1);

export const getB2BLineTotal = (item) => item.b2bPrice * item.quantity;

export const getB2BCartSummary = (items) => {
  const subtotal = items.reduce((sum, item) => sum + getB2BLineTotal(item), 0);
  const gst = Math.round(subtotal * 0.12);
  const delivery = subtotal >= 10000 || subtotal === 0 ? 0 : 250;
  const total = subtotal + gst + delivery;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return { subtotal, gst, delivery, total, itemCount };
};

const b2bPurchaseSlice = createSlice({
  name: 'b2bPurchase',
  initialState,
  reducers: {
    selectB2BBusiness: (state, action) => {
      state.selectedBusinessId = action.payload;
    },
    addB2BItem: (state, action) => {
      const { product, quantity } = action.payload;
      const existing = state.cart.find((item) => item.id === product.id);

      if (existing) {
        existing.quantity += quantity;
        return;
      }

      state.cart.push({
        id: product.id,
        name: product.name,
        brand: product.brand,
        category: product.category,
        image: product.image,
        stock: product.stock,
        mrp: product.mrp,
        retailPrice: product.price,
        b2bPrice: getB2BUnitPrice(product),
        quantity,
      });
    },
    updateB2BQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      if (quantity < 1) {
        state.cart = state.cart.filter((item) => item.id !== productId);
        return;
      }

      const item = state.cart.find((cartItem) => cartItem.id === productId);
      if (item) {
        item.quantity = quantity;
      }
    },
    removeB2BItem: (state, action) => {
      state.cart = state.cart.filter((item) => item.id !== action.payload);
    },
    clearB2BCart: (state) => {
      state.cart = [];
    },
    placeB2BOrder: {
      reducer: (state, action) => {
        state.orders.unshift(action.payload);
        state.cart = [];
      },
      prepare: (payload) => ({
        payload: {
          ...payload,
          id: `B2B-PO-${Date.now()}`,
          status: 'Pending Approval',
          createdAt: new Date().toISOString(),
        },
      }),
    },
  },
});

export const {
  selectB2BBusiness,
  addB2BItem,
  updateB2BQuantity,
  removeB2BItem,
  clearB2BCart,
  placeB2BOrder,
} = b2bPurchaseSlice.actions;

export const selectB2BCartSummary = (state) => getB2BCartSummary(state.b2bPurchase.cart);

export const persistB2BPurchaseState = (state) => {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(state.b2bPurchase.cart));
  window.localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(state.b2bPurchase.orders));
};

export default b2bPurchaseSlice.reducer;

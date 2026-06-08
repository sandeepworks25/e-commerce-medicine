import { configureStore } from '@reduxjs/toolkit';
import businessReducer from './businessSlice';
import b2bPurchaseReducer, { persistB2BPurchaseState } from './b2bPurchaseSlice';

export const store = configureStore({
  reducer: {
    business: businessReducer,
    b2bPurchase: b2bPurchaseReducer,
  },
});

store.subscribe(() => {
  if (typeof window === 'undefined') return;

  const businesses = store.getState().business.businesses;
  window.localStorage.setItem('b2b_businesses', JSON.stringify(businesses));
  persistB2BPurchaseState(store.getState());
});

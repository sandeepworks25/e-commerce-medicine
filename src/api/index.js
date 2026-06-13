import { api, assetUrl, tokens } from './client.js';

// Normalize a backend product to the shape storefront components expect
// (numeric-ish `id`, absolute image URL, array fields). Keeps `_id` for API calls.
export function normalizeProduct(p) {
  if (!p) return p;
  return {
    ...p,
    id: p._id || p.id,
    _id: p._id || p.id,
    image: assetUrl(p.image),
    images: Array.isArray(p.images) ? p.images.map(assetUrl) : [],
    uses: p.uses || [],
    benefits: p.benefits || [],
    ingredients: p.ingredients || [],
    sideEffects: p.sideEffects || [],
    price: p.price ?? 0,
    mrp: p.mrp ?? 0,
    rating: p.rating ?? 0,
    reviews: p.reviews ?? 0,
    stock: p.stock ?? 0,
  };
}

function normalizeCartItem(item) {
  return { ...normalizeProduct(item.product), quantity: item.quantity };
}

// --- auth ------------------------------------------------------------------

export const authApi = {
  async register(payload) {
    const { data } = await api.post('/auth/register', payload);
    tokens.set(data.accessToken, data.refreshToken);
    return data;
  },
  async login(login, password) {
    const { data } = await api.post('/auth/login', { login, password });
    tokens.set(data.accessToken, data.refreshToken);
    return data;
  },
  async me() {
    const { data } = await api.get('/auth/me');
    return data;
  },
  logout() {
    tokens.clear();
  },
  isAuthenticated() {
    return !!tokens.access;
  },
};

// --- catalog (public) ------------------------------------------------------

export const catalogApi = {
  async products() {
    const { data } = await api.get('/catalog/products');
    return data.map(normalizeProduct);
  },
  async categories() {
    const { data } = await api.get('/catalog/categories');
    return data;
  },
  async subCategories() {
    const { data } = await api.get('/catalog/sub-categories');
    return data;
  },
  async brands() {
    const { data } = await api.get('/catalog/brands');
    return data;
  },
  async manufacturers() {
    const { data } = await api.get('/catalog/manufacturers');
    return data;
  },
};

// --- cart ------------------------------------------------------------------

export const cartApi = {
  async get() {
    const { data } = await api.get('/cart');
    return (data.items || []).map(normalizeCartItem);
  },
  async add(productId, quantity = 1) {
    const { data } = await api.post('/cart/items', { product: productId, quantity });
    return (data.items || []).map(normalizeCartItem);
  },
  async update(productId, quantity) {
    const { data } = await api.put(`/cart/items/${productId}`, { quantity });
    return (data.items || []).map(normalizeCartItem);
  },
  async remove(productId) {
    const { data } = await api.delete(`/cart/items/${productId}`);
    return (data.items || []).map(normalizeCartItem);
  },
  async clear() {
    await api.delete('/cart');
    return [];
  },
};

// --- wishlist --------------------------------------------------------------

export const wishlistApi = {
  async get() {
    const { data } = await api.get('/wishlist');
    return (data.products || []).map(normalizeProduct);
  },
  async add(productId) {
    const { data } = await api.post(`/wishlist/${productId}`);
    return (data.products || []).map(normalizeProduct);
  },
  async remove(productId) {
    const { data } = await api.delete(`/wishlist/${productId}`);
    return (data.products || []).map(normalizeProduct);
  },
};

// --- orders ----------------------------------------------------------------

export const ordersApi = {
  async list() {
    const { data } = await api.get('/orders');
    return data;
  },
  async get(id) {
    const { data } = await api.get(`/orders/${id}`);
    return data;
  },
  async create(payload) {
    const { data } = await api.post('/orders', payload);
    return data;
  },
};

// --- prescriptions ---------------------------------------------------------

export const prescriptionsApi = {
  async list() {
    const { data } = await api.get('/prescriptions');
    return data;
  },
  async upload(file, notes) {
    const fd = new FormData();
    fd.append('file', file);
    if (notes) fd.append('notes', notes);
    const { data } = await api.post('/prescriptions', fd);
    return data;
  },
};

// --- addresses -------------------------------------------------------------

export const addressesApi = {
  async list() {
    const { data } = await api.get('/account/addresses');
    return data;
  },
  async add(payload) {
    const { data } = await api.post('/account/addresses', payload);
    return data;
  },
  async update(id, payload) {
    const { data } = await api.put(`/account/addresses/${id}`, payload);
    return data;
  },
  async remove(id) {
    const { data } = await api.delete(`/account/addresses/${id}`);
    return data;
  },
};

export { assetUrl, tokens };

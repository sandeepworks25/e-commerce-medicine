import axios from 'axios';

const RAW_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
export const API_BASE = `${RAW_BASE.replace(/\/+$/, '')}/api`;

const ACCESS_KEY = 'med_access_token';
const REFRESH_KEY = 'med_refresh_token';

export const tokens = {
  get access() {
    return localStorage.getItem(ACCESS_KEY);
  },
  get refresh() {
    return localStorage.getItem(REFRESH_KEY);
  },
  set(accessToken, refreshToken) {
    if (accessToken) localStorage.setItem(ACCESS_KEY, accessToken);
    if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
  },
  clear() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

export const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = tokens.access;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Single-flight refresh on 401, then retry once.
let refreshing = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    const isAuthCall = original?.url?.includes('/auth/');

    // Don't attempt refresh on auth endpoints — let the real 401 message
    // (e.g. "Invalid user credentials.") reach the caller.
    if (status === 401 && !original._retry && tokens.refresh && !isAuthCall) {
      original._retry = true;
      try {
        refreshing =
          refreshing ||
          axios.post(`${API_BASE}/auth/refresh`, { refreshToken: tokens.refresh });
        const { data } = await refreshing;
        refreshing = null;
        tokens.set(data.accessToken, data.refreshToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch (e) {
        refreshing = null;
        tokens.clear();
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  },
);

// Resolve a stored asset key/url to an absolute URL (local provider keys are
// served from /uploads).
export function assetUrl(keyOrUrl) {
  if (!keyOrUrl) return '';
  if (/^(https?:|blob:|data:)/.test(keyOrUrl)) return keyOrUrl;
  let clean = String(keyOrUrl).replace(/^\/+/, '');
  if (!clean.startsWith('uploads/')) clean = `uploads/${clean}`;
  return `${RAW_BASE.replace(/\/+$/, '')}/${clean}`;
}

export function apiErrorMessage(error, fallback = 'Something went wrong') {
  const msg = error?.response?.data?.message;
  if (Array.isArray(msg)) return msg.join(', ');
  return typeof msg === 'string' ? msg : fallback;
}

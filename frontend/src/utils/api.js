import axios from 'axios';

// 🔥 Safe baseURL (handles missing env properly)
const BASE_URL =
  import.meta.env.VITE_API_URL?.trim() ||
  (import.meta.env.DEV ? 'http://localhost:5000' : '');

if (!BASE_URL) {
  console.error('❌ VITE_API_URL is not set!');
}

// ✅ Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// ✅ Attach token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🔐 Auto logout on unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // 🌐 Better network error handling
    if (!error.response) {
      console.error('🌐 Network error - backend unreachable');
    }

    return Promise.reject(error);
  }
);

export default api;
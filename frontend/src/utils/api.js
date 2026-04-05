import axios from 'axios';
import { mockApi } from '../data/mockProducts';

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true' || false;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // 5 second timeout
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Mock data fallback wrapper
const withMockFallback = async (apiCall, mockCall) => {
  if (USE_MOCK_DATA) {
    return mockCall();
  }
  
  try {
    return await apiCall();
  } catch (error) {
    // If backend fails, use mock data
    console.warn('Backend unavailable, using mock data:', error.message);
    return mockCall();
  }
};

// Product APIs with mock fallback
export const productApi = {
  getProducts: (params = {}) => withMockFallback(
    () => api.get('/products', { params }),
    () => mockApi.getProducts(params)
  ),
  
  getProductById: (id) => withMockFallback(
    () => api.get(`/products/${id}`),
    () => mockApi.getProductById(id)
  ),
  
  getFeaturedProducts: () => withMockFallback(
    () => api.get('/products/featured'),
    () => mockApi.getFeaturedProducts()
  ),
  
  getCategories: () => withMockFallback(
    () => api.get('/products/categories'),
    () => mockApi.getCategories()
  ),
  
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

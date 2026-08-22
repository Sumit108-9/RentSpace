import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const API_ROOT = `${API_BASE_URL}/api`;

const api = axios.create({
  baseURL: API_ROOT,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Attach token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // #region agent log
    fetch('http://127.0.0.1:7633/ingest/82148fb8-03cb-44ac-8ce0-01502e70d163',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'ecd83c'},body:JSON.stringify({sessionId:'ecd83c',runId:'pre-fix',hypothesisId:'A',location:'api.js:request',message:'API request',data:{baseURL:config.baseURL,url:config.url,fullUrl:`${config.baseURL || API_ROOT}${config.url}`},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Auto logout on unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Better network error handling
    if (!error.response) {
      console.error('Network error - backend unreachable');
    }

    return Promise.reject(error);
  }
);

export default api;
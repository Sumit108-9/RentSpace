// Frontend API Response Cache
// Uses localStorage with TTL for caching API responses

const CACHE_PREFIX = 'rentspace_cache_';
const DEFAULT_TTL = 10 * 60 * 1000; // 10 minutes in milliseconds

export const apiCache = {
  /**
   * Generate a cache key from URL and params
   */
  getKey(url, params = {}) {
    const paramsString = Object.keys(params).length > 0 
      ? JSON.stringify(params) 
      : '';
    return `${CACHE_PREFIX}${url}${paramsString}`;
  },

  /**
   * Get cached data
   */
  get(url, params = {}) {
    try {
      const key = this.getKey(url, params);
      const item = localStorage.getItem(key);
      
      if (!item) return null;
      
      const { data, timestamp, ttl } = JSON.parse(item);
      const now = Date.now();
      
      // Check if cache has expired
      if (now - timestamp > ttl) {
        localStorage.removeItem(key);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  },

  /**
   * Set cache data
   */
  set(url, data, params = {}, ttl = DEFAULT_TTL) {
    try {
      const key = this.getKey(url, params);
      const item = {
        data,
        timestamp: Date.now(),
        ttl
      };
      localStorage.setItem(key, JSON.stringify(item));
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      // If localStorage is full, clear old cache entries
      if (error.name === 'QuotaExceededError') {
        this.clearExpired();
      }
      return false;
    }
  },

  /**
   * Clear specific cache entry
   */
  clear(url, params = {}) {
    try {
      const key = this.getKey(url, params);
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Cache clear error:', error);
      return false;
    }
  },

  /**
   * Clear all expired cache entries
   */
  clearExpired() {
    try {
      const now = Date.now();
      let cleared = 0;
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(CACHE_PREFIX)) {
          try {
            const item = JSON.parse(localStorage.getItem(key));
            if (now - item.timestamp > item.ttl) {
              localStorage.removeItem(key);
              cleared++;
            }
          } catch (e) {
            // Invalid item, remove it
            localStorage.removeItem(key);
            cleared++;
          }
        }
      }
      
      return cleared;
    } catch (error) {
      console.error('Clear expired cache error:', error);
      return 0;
    }
  },

  /**
   * Clear all API cache
   */
  clearAll() {
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(CACHE_PREFIX)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      return keysToRemove.length;
    } catch (error) {
      console.error('Clear all cache error:', error);
      return 0;
    }
  },

  /**
   * Invalidate cache by pattern (e.g., all product-related caches)
   */
  invalidatePattern(pattern) {
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(CACHE_PREFIX) && key.includes(pattern)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      return keysToRemove.length;
    } catch (error) {
      console.error('Invalidate pattern error:', error);
      return 0;
    }
  }
};

// Product-specific cache helpers
export const productCache = {
  getList(params = {}) {
    return apiCache.get('/api/products', params);
  },

  setList(data, params = {}) {
    return apiCache.set('/api/products', data, params, 5 * 60 * 1000); // 5 minutes
  },

  getDetail(id) {
    return apiCache.get(`/api/products/${id}`);
  },

  setDetail(id, data) {
    return apiCache.set(`/api/products/${id}`, data, {}, 15 * 60 * 1000); // 15 minutes
  },

  getFeatured() {
    return apiCache.get('/api/products/featured');
  },

  setFeatured(data) {
    return apiCache.set('/api/products/featured', data, {}, 10 * 60 * 1000); // 10 minutes
  },

  invalidate() {
    return apiCache.invalidatePattern('/api/products');
  }
};

// Order cache helpers
export const orderCache = {
  getList(params = {}) {
    return apiCache.get('/api/orders', params);
  },

  setList(data, params = {}) {
    return apiCache.set('/api/orders', data, params, 2 * 60 * 1000); // 2 minutes
  },

  invalidate() {
    return apiCache.invalidatePattern('/api/orders');
  }
};

export default apiCache;

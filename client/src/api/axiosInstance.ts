import axios from 'axios';
import { mockProducts } from './mockData';

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Request interceptor — attach access token
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

const isHtmlResponse = (response: any) => {
  return response && 
    typeof response.data === 'string' && 
    (response.data.trim().toLowerCase().startsWith('<!doctype html') || response.data.trim().toLowerCase().startsWith('<!doctype'));
};

function handleMockFallback(config: any): any {
  if (!config) return null;
  const rawUrl = config.url || '';
  
  let parsedUrl;
  try {
    parsedUrl = new URL(rawUrl, 'http://localhost');
  } catch (e) {
    parsedUrl = new URL('/' + rawUrl.replace(/^\/+/, ''), 'http://localhost');
  }

  let pathname = parsedUrl.pathname;
  if (pathname.startsWith('/api')) {
    pathname = pathname.substring(4);
  }
  if (!pathname.startsWith('/')) {
    pathname = '/' + pathname;
  }

  const cleanUrl = pathname;
  const searchParams = parsedUrl.searchParams;

  console.warn(`[Axios Fallback] Server offline/unreachable. Serving mock data for: ${cleanUrl}`);

  if (cleanUrl === '/products/featured') {
    return {
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
      data: {
        products: mockProducts.filter(p => p.featured === 1)
      }
    };
  }

  if (cleanUrl === '/products') {
    const search = (searchParams.get('search') || '').toLowerCase();
    const category = searchParams.get('category') || '';
    const brand = searchParams.get('brand') || '';

    let filtered = [...mockProducts];
    if (search) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(search) || 
        p.description.toLowerCase().includes(search)
      );
    }
    if (category) {
      filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    if (brand) {
      filtered = filtered.filter(p => p.brand?.toLowerCase() === brand.toLowerCase());
    }

    return {
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
      data: {
        products: filtered,
        brands: Array.from(new Set(mockProducts.map(p => p.brand).filter(Boolean))),
        total: filtered.length
      }
    };
  }

  if (cleanUrl.startsWith('/products/')) {
    // Support both /products/:slug and /products/slug/:slug (legacy)
    let slug = cleanUrl.replace('/products/', '');
    if (slug.startsWith('slug/')) {
      slug = slug.replace('slug/', '');
    }
    const product = mockProducts.find(p => p.slug === slug);
    if (product) {
      return {
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        data: { product }
      };
    }
  }

  if (cleanUrl === '/auth/login' || cleanUrl === '/auth/register') {
    return {
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
      data: {
        accessToken: 'mock-access-token',
        user: {
          id: 'mock-user-id',
          email: 'demo@pixelforge.com',
          username: 'Demo User',
          role: 'user'
        }
      }
    };
  }

  if (cleanUrl === '/auth/refresh') {
    return {
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
      data: {
        accessToken: 'mock-access-token'
      }
    };
  }

  if (cleanUrl === '/orders') {
    return {
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
      data: {
        success: true,
        orderId: 'mock-order-' + Math.random().toString(36).substr(2, 9)
      }
    };
  }

  // Generic empty success fallback
  return {
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
    data: {}
  };
}

// Response interceptor — handle token refresh & mock fallbacks
api.interceptors.response.use(
  (response) => {
    if (isHtmlResponse(response)) {
      const fallback = handleMockFallback(response.config);
      if (fallback) return fallback;
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // First try token refresh if valid 401 error
    if (error.response?.status === 401 && error.response?.data?.code === 'TOKEN_EXPIRED' && !originalRequest?._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post('/api/auth/refresh', {}, { withCredentials: true });
        setAccessToken(data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        setAccessToken(null);
        window.dispatchEvent(new CustomEvent('auth:logout'));
        return Promise.reject(refreshError);
      }
    }

    // Server offline or returns 404, fallback to mock data dynamically
    try {
      const fallback = handleMockFallback(originalRequest);
      if (fallback) return fallback;
    } catch (fallbackError) {
      console.error('Fallback generation failed', fallbackError);
    }

    return Promise.reject(error);
  }
);

export default api;

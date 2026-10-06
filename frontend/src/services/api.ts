import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRedirecting = false;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || '';

      const skipRedirect =
        url.includes('/auth/me') ||
        url.includes('/auth/login') ||
        url.includes('/auth/register');

      if (!skipRedirect && !isRedirecting) {
        isRedirecting = true;
        const protectedPaths = ['/carrinho', '/pedidos', '/admin'];
        const isProtected = protectedPaths.some((p) =>
          window.location.pathname.startsWith(p)
        );

        if (isProtected) {
          window.location.href = '/login';
        }
        setTimeout(() => {
          isRedirecting = false;
        }, 1000);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRedirecting = false;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Sessão expirada ou não autenticado
    if (error.response?.status === 401) {
      const url = error.config?.url || '';

      // Não redirecionar se já está em login/register ou se é /auth/me
      const skipRedirect =
        url.includes('/auth/me') ||
        url.includes('/auth/login') ||
        url.includes('/auth/register');

      if (!skipRedirect && !isRedirecting) {
        isRedirecting = true;
        // Só redireciona se o usuário estava numa rota protegida
        const protectedPaths = ['/carrinho', '/pedidos', '/admin'];
        const isProtected = protectedPaths.some((p) => window.location.pathname.startsWith(p));

        if (isProtected) {
          window.location.href = '/login';
        }
        setTimeout(() => { isRedirecting = false; }, 1000);
      }
    }
    return Promise.reject(error);
  }
);

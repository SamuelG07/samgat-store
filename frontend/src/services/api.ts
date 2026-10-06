import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';

const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:3000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

let isRedirecting = false;

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && !isRedirecting) {
      const protectedPaths = [
        '/admin',
        '/carrinho',
        '/pedidos',
        '/perfil',
        '/checkout',
      ];

      const currentPath = window.location.pathname;

      const isProtected = protectedPaths.some((path) =>
        currentPath.startsWith(path)
      );

      if (isProtected && currentPath !== '/login') {
        isRedirecting = true;
        window.location.href = '/login';

        setTimeout(() => {
          isRedirecting = false;
        }, 1000);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

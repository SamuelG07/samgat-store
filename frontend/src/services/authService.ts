import { api } from './api';
import { AdminUser, SingleResponse } from '../types/admin';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: AdminUser;
  message: string;
}

export const authApi = {
  async login(data: LoginData): Promise<AdminUser> {
    const response = await api.post<SingleResponse<AuthResponse>>('/auth/login', data);
    return response.data.data.user;
  },

  async register(data: RegisterData): Promise<AdminUser> {
    const response = await api.post<SingleResponse<{ user: AdminUser }>>('/auth/register', data);
    return response.data.data.user;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  async me(): Promise<AdminUser> {
    const response = await api.get<SingleResponse<{ user: AdminUser }>>('/auth/me');
    return response.data.data.user;
  },
};

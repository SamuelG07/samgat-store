export type UserRole = 'CUSTOMER' | 'ADMIN';

export interface TokenPayload {
  userId: number;
  email: string;
  role: UserRole;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

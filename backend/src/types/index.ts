// Tipos base para a aplicação
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Serão expandidos com os modelos do Prisma após db pull
export type User = any;
export type Product = any;
export type Category = any;
export type Order = any;
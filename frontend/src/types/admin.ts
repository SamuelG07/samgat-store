export type UserRole = 'CUSTOMER' | 'ADMIN';
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type StockMovementType = 'IN' | 'OUT' | 'ADJUSTMENT';

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  ordersCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminProduct {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  categoryId: number;
  category: { id: number; name: string; slug: string } | null;
  imageUrl: string | null;
  isActive: boolean;
  stock: number;
  lowStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminOrder {
  id: number;
  userId: number;
  user: { id: number; name: string; email: string };
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  total: number;
  itemsCount: number;
  items?: Array<{
    id: number;
    productId: number;
    product: { id: number; name: string; slug: string };
    quantity: number;
    price: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardMetrics {
  products: { total: number; active: number; inactive: number };
  categories: { total: number };
  users: { total: number };
  orders: {
    total: number;
    pending: number;
    confirmed: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  inventory: { lowStock: number; threshold: number };
  revenue: { total: number };
}

export interface DashboardData {
  metrics: DashboardMetrics;
  recentOrders: AdminOrder[];
  lowStockProducts: Array<{
    id: number;
    productId: number;
    quantity: number;
    products: { id: number; name: string; slug: string; is_active: boolean; image_url: string | null };
  }>;
}

export interface StockMovement {
  id: number;
  productId: number;
  product: { id: number; name: string; slug: string };
  type: StockMovementType;
  quantity: number;
  reason: string | null;
  createdAt: string;
}

export interface InventoryItem {
  id: number;
  productId: number;
  product: { id: number; name: string; slug: string; price: string; image_url: string | null; is_active: boolean };
  quantity: number;
  lowStock: boolean;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: Pagination;
}

export interface SingleResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

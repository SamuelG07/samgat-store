export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  category_id: number;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Backend retorna cart_items com products (plural)
export interface CartItemRaw {
  id: number;
  product_id: number;
  quantity: number;
  products: {
    id: number;
    name: string;
    price: string;
    image_url: string | null;
    is_active: boolean;
  };
}

// Formato normalizado que o frontend usa
export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: string;
    image_url: string | null;
    is_active: boolean;
  };
  subtotal: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
  totalItems: number;
  subtotal: number;
}

// Backend retorna order_items com products (plural)
export interface OrderItemRaw {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: string;
  created_at: string;
  products: {
    id: number;
    name: string;
    price: string;
    image_url: string | null;
  };
}

export interface Order {
  id: number;
  user_id: number;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  payment_status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  total: string;
  created_at: string;
  updated_at: string;
  order_items: OrderItemRaw[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  pagination: Pagination;
}

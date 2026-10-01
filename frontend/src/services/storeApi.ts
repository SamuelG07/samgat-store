import { api } from './api';
import { Product, Category, Cart, CartItem, Order, ProductsResponse } from '../types/store';

// ===== PRODUCTS =====
export const productsApi = {
  async list(params: {
    page?: number;
    limit?: number;
    search?: string;
    category?: number;
    sort?: string;
  } = {}): Promise<ProductsResponse> {
    const response = await api.get('/products', { params });
    return response.data;
  },

  async getById(id: number): Promise<Product> {
    const response = await api.get(`/products/${id}`);
    return response.data.data;
  },

  async getBySlug(slug: string): Promise<Product> {
    const response = await api.get(`/products/slug/${slug}`);
    return response.data.data;
  },
};

// ===== CATEGORIES =====
export const categoriesApi = {
  async list(): Promise<Category[]> {
    const response = await api.get('/categories');
    return response.data.data;
  },

  async getById(id: number): Promise<Category> {
    const response = await api.get(`/categories/${id}`);
    return response.data.data;
  },
};

// ===== CART (normaliza cart_items → items, products → product) =====
export const cartApi = {
  async get(): Promise<Cart> {
    const response = await api.get('/cart');
    const raw = response.data.data;

    // Normalizar
    const items: CartItem[] = (raw.cart_items || raw.items || []).map((item: any) => {
      const product = item.products || item.product;
      const price = Number(product?.price || 0);
      return {
        id: item.id,
        productId: item.product_id || item.productId,
        quantity: item.quantity,
        product: {
          id: product?.id,
          name: product?.name || 'Produto',
          price: product?.price || '0',
          image_url: product?.image_url || null,
          is_active: product?.is_active ?? true,
        },
        subtotal: price * item.quantity,
      };
    });

    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = items.reduce((sum, i) => sum + i.subtotal, 0);

    return {
      id: raw.id,
      items,
      totalItems,
      subtotal,
    };
  },

  async addItem(productId: number, quantity: number): Promise<Cart> {
    await api.post('/cart/items', { productId, quantity });
    return this.get();
  },

  async updateItem(itemId: number, quantity: number): Promise<Cart> {
    await api.put(`/cart/items/${itemId}`, { quantity });
    return this.get();
  },

  async removeItem(itemId: number): Promise<Cart> {
    await api.delete(`/cart/items/${itemId}`);
    return this.get();
  },

  async clear(): Promise<Cart> {
    await api.delete('/cart');
    return this.get();
  },
};

// ===== ORDERS =====
export const ordersApi = {
  async checkout(): Promise<any> {
    const response = await api.post('/orders/checkout');
    return response.data;
  },

  async list(params: { page?: number; limit?: number } = {}): Promise<{
    data: Order[];
    pagination: any;
  }> {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  async getById(id: number): Promise<Order> {
    const response = await api.get(`/orders/${id}`);
    return response.data.data;
  },
};

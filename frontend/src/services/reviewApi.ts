import { api } from './api';

export interface Review {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: { id: number; name: string };
}

export interface ReviewStats {
  average: number;
  total: number;
}

export interface ReviewsResponse {
  success: boolean;
  data: Review[];
  stats: ReviewStats;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const reviewApi = {
  async getByProduct(productId: number, page = 1, limit = 10): Promise<ReviewsResponse> {
    const res = await api.get(`/reviews/product/${productId}`, { params: { page, limit } });
    return res.data;
  },

  async create(data: { productId: number; orderId: number; rating: number; comment?: string }) {
    const res = await api.post('/reviews', data);
    return res.data.data;
  },

  async remove(id: number) {
    await api.delete(`/reviews/${id}`);
  },
};

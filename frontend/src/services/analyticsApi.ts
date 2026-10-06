import { api } from './api';

export const analyticsApi = {
  async getSalesOverTime(from: string, to: string) {
    const res = await api.get('/admin/analytics/sales', { params: { from, to } });
    return res.data.data;
  },
  async getTopProducts(limit = 5) {
    const res = await api.get('/admin/analytics/top-products', { params: { limit } });
    return res.data.data;
  },
  async getSalesByCategory() {
    const res = await api.get('/admin/analytics/categories');
    return res.data.data;
  },
  async getCustomerGrowth(from: string, to: string) {
    const res = await api.get('/admin/analytics/customers/growth', { params: { from, to } });
    return res.data.data;
  },
  async getCustomerStats() {
    const res = await api.get('/admin/analytics/customers/stats');
    return res.data.data;
  },
};

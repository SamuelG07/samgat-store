import { analyticsRepository } from '../repositories/analyticsRepository';

export class AnalyticsService {
  async getSalesOverTime(from: string, to: string) {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);

    return analyticsRepository.getSalesOverTime(fromDate, toDate);
  }

  async getTopProducts(limit: number = 5) {
    return analyticsRepository.getTopProducts(limit);
  }

  async getSalesByCategory() {
    return analyticsRepository.getSalesByCategory();
  }

  async getCustomerGrowth(from: string, to: string) {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);

    return analyticsRepository.getCustomerGrowth(fromDate, toDate);
  }

  async getCustomerStats() {
    return analyticsRepository.getCustomerStats();
  }
}

export const analyticsService = new AnalyticsService();

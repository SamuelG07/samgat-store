import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../../services/analyticsApi';

export function useSalesOverTime(from: Date, to: Date) {
  const fromStr = from.toISOString().split('T')[0];
  const toStr = to.toISOString().split('T')[0];

  return useQuery({
    queryKey: ['analytics', 'sales', fromStr, toStr],
    queryFn: () => analyticsApi.getSalesOverTime(fromStr, toStr),
  });
}

export function useTopProducts(limit = 5) {
  return useQuery({
    queryKey: ['analytics', 'top-products', limit],
    queryFn: () => analyticsApi.getTopProducts(limit),
  });
}

export function useSalesByCategory() {
  return useQuery({
    queryKey: ['analytics', 'categories'],
    queryFn: () => analyticsApi.getSalesByCategory(),
  });
}

export function useCustomerGrowth(from: Date, to: Date) {
  const fromStr = from.toISOString().split('T')[0];
  const toStr = to.toISOString().split('T')[0];

  return useQuery({
    queryKey: ['analytics', 'customers-growth', fromStr, toStr],
    queryFn: () => analyticsApi.getCustomerGrowth(fromStr, toStr),
  });
}

export function useCustomerStats() {
  return useQuery({
    queryKey: ['analytics', 'customers-stats'],
    queryFn: () => analyticsApi.getCustomerStats(),
  });
}

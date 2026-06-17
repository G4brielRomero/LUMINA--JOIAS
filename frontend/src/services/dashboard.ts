import { api } from './api';

export interface DashboardData {
  total_products: number;
  total_customers: number;
  total_orders: number;
  total_revenue: number;
  recent_orders?: unknown[];
  [key: string]: unknown;
}

export async function getDashboard(): Promise<DashboardData> {
  const response = await api.get<DashboardData>('/dashboard');
  return response.data;
}

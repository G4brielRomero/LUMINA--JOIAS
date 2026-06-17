import { api } from './api';

export type OrderStatus = 'pending' | 'confirmed' | 'delivered' | 'cancelled';

export interface OrderItem {
  product_id: string;
  quantity: number;
}

export interface CreateOrderData {
  customer_id: string;
  notes?: string;
  items: OrderItem[];
}

export interface Order {
  id: string;
  customer_id: string;
  notes?: string;
  status: OrderStatus;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export async function getOrders(params?: { status?: string; date?: string }): Promise<Order[]> {
  const response = await api.get<Order[]>('/orders', { params });
  return response.data;
}

export async function getOrder(id: string): Promise<Order> {
  const response = await api.get<Order>(`/orders/${id}`);
  return response.data;
}

export async function createOrder(data: CreateOrderData): Promise<Order> {
  const response = await api.post<Order>('/orders', data);
  return response.data;
}

export async function updateOrderStatus(id: string, status: string): Promise<Order> {
  const response = await api.patch<Order>(`/orders/${id}/status`, { status });
  return response.data;
}

import { api } from './api';

export interface CreateCustomerData {
  name: string;
  cpf: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface Customer extends CreateCustomerData {
  id: string;
  created_at: string;
  updated_at: string;
}

export async function getCustomers(search?: string): Promise<Customer[]> {
  const response = await api.get<Customer[]>('/customers', {
    params: search ? { search } : undefined,
  });
  return response.data;
}

export async function getCustomer(id: string): Promise<Customer> {
  const response = await api.get<Customer>(`/customers/${id}`);
  return response.data;
}

export async function getCustomerOrders(id: string): Promise<unknown[]> {
  const response = await api.get<unknown[]>(`/customers/${id}/orders`);
  return response.data;
}

export async function createCustomer(data: CreateCustomerData): Promise<Customer> {
  const response = await api.post<Customer>('/customers', data);
  return response.data;
}

export async function updateCustomer(
  id: string,
  data: Partial<CreateCustomerData>
): Promise<Customer> {
  const response = await api.patch<Customer>(`/customers/${id}`, data);
  return response.data;
}

export async function deleteCustomer(id: string): Promise<void> {
  await api.delete(`/customers/${id}`);
}

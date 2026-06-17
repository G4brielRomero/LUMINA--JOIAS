import { api } from './api';

export interface CreateProductData {
  name: string;
  description?: string;
  material: string;
  gemstone?: string;
  weight_g: number;
  price: number;
  stock: number;
  image_url?: string;
}

export interface Product extends CreateProductData {
  id: string;
  created_at: string;
  updated_at: string;
}

export async function getProducts(params?: { material?: string; name?: string }): Promise<Product[]> {
  const response = await api.get<Product[]>('/products', { params });
  return response.data;
}

export async function getProduct(id: string): Promise<Product> {
  const response = await api.get<Product>(`/products/${id}`);
  return response.data;
}

export async function createProduct(data: CreateProductData): Promise<Product> {
  const response = await api.post<Product>('/products', data);
  return response.data;
}

export async function updateProduct(
  id: string,
  data: Partial<CreateProductData>
): Promise<Product> {
  const response = await api.patch<Product>(`/products/${id}`, data);
  return response.data;
}

export async function deleteProduct(id: string): Promise<void> {
  await api.delete(`/products/${id}`);
}

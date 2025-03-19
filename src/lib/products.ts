import { supabase } from './supabase';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  description?: string;
  quantity: number;
  min_quantity: number;
  price: number;
  status: 'normal' | 'low' | 'critical';
  notes?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface CreateProductData {
  name: string;
  sku: string;
  category: string;
  description?: string;
  quantity: number;
  min_quantity: number;
  price: number;
  status: 'normal' | 'low' | 'critical';
  notes?: string;
}

export async function createProduct(data: CreateProductData): Promise<Product> {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    throw new Error('Usuário não autenticado');
  }

  const { data: product, error } = await supabase
    .from('products')
    .insert([{ ...data, user_id: user.user.id }])
    .select()
    .single();

  if (error) {
    console.error('Error creating product:', error);
    throw new Error(error.message);
  }

  return product;
}

export async function getProducts(): Promise<Product[]> {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    throw new Error('Usuário não autenticado');
  }

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', user.user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    throw new Error(error.message);
  }

  return products;
}

export async function updateProduct(id: string, data: Partial<CreateProductData>): Promise<Product> {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    throw new Error('Usuário não autenticado');
  }

  const { data: product, error } = await supabase
    .from('products')
    .update(data)
    .eq('id', id)
    .eq('user_id', user.user.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating product:', error);
    throw new Error(error.message);
  }

  return product;
}

export async function deleteProduct(id: string): Promise<void> {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    throw new Error('Usuário não autenticado');
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
    .eq('user_id', user.user.id);

  if (error) {
    console.error('Error deleting product:', error);
    throw new Error(error.message);
  }
}

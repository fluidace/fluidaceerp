import { supabase } from './supabase';

export interface Customer {
  id: string;
  name: string;
  email: string | null;
  document: string | null;
  type: 'Física' | 'Jurídica' | null;
  phone: string | null;
  address: string | null;
  status: 'Ativo' | 'Inativo' | 'VIP';
  notes: string | null;
  total_purchases: number;
  last_purchase: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateCustomerData {
  name: string;
  email?: string;
  document?: string;
  type?: 'Física' | 'Jurídica';
  phone?: string;
  address?: string;
  status?: 'Ativo' | 'Inativo' | 'VIP';
  notes?: string;
}

export async function createCustomer(data: CreateCustomerData) {
  const { data: customer, error } = await supabase
    .from('customers')
    .insert([{
      ...data,
      user_id: (await supabase.auth.getUser()).data.user?.id
    }])
    .select()
    .single();

  if (error) throw error;
  return customer;
}

export async function getCustomers() {
  const { data: customers, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return customers;
}

export async function updateCustomer(id: string, data: Partial<CreateCustomerData>) {
  const { data: customer, error } = await supabase
    .from('customers')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return customer;
}

export async function deleteCustomer(id: string) {
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
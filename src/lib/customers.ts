import { supabase } from './supabase';
import { subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface Customer {
  id: string;
  name: string;
  email: string;
  document: string;
  phone: string;
  type: 'pf' | 'pj';
  status: 'ativo' | 'inativo' | 'vip';
  address?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerFilters {
  status?: string;
  type?: string;
  startDate?: Date;
  endDate?: Date;
  searchTerm?: string;
}

export interface CreateCustomerData {
  name: string;
  email?: string;
  document?: string;
  type?: 'pf' | 'pj';
  phone?: string;
  address?: string;
  status?: 'ativo' | 'inativo' | 'vip';
  notes?: string;
}

export async function createCustomer(data: CreateCustomerData): Promise<Customer> {
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

export async function getCustomers(filters?: CustomerFilters): Promise<Customer[]> {
  let query = supabase
    .from('customers')
    .select('*');

  if (filters) {
    // Status filter
    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    // Type filter
    if (filters.type) {
      query = query.eq('type', filters.type);
    }

    // Start date filter
    if (filters.startDate) {
      query = query.gte('created_at', filters.startDate.toISOString());
    }

    // End date filter
    if (filters.endDate) {
      query = query.lte('created_at', filters.endDate.toISOString());
    }

    // Search term (multiple fields)
    if (filters.searchTerm) {
      query = query.or(`
        name.ilike.%${filters.searchTerm}%,
        document.ilike.%${filters.searchTerm}%,
        email.ilike.%${filters.searchTerm}%,
        phone.ilike.%${filters.searchTerm}%
      `);
    }
  }

  // Always order by most recent first
  query = query.order('created_at', { ascending: false });

  const { data: customers, error } = await query;

  if (error) throw error;
  return customers;
}

export async function updateCustomer(id: string, data: Partial<CreateCustomerData>): Promise<Customer> {
  const { data: customer, error } = await supabase
    .from('customers')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return customer;
}

export async function deleteCustomer(id: string): Promise<void> {
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
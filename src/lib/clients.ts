import { supabase } from './supabase';

export interface Client {
  id: string;
  name: string;
  document: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  type: 'PF' | 'PJ';
  active: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface CreateClientInput {
  name: string;
  document: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  type: 'PF' | 'PJ';
}

export async function getClients(page: number = 1, limit: number = 10, search?: string): Promise<{ data: Client[]; count: number }> {
  try {
    let query = supabase
      .from('clients')
      .select('*', { count: 'exact' })
      .eq('active', true)
      .order('name');

    if (search) {
      query = query.or(`name.ilike.%${search}%,document.ilike.%${search}%`);
    }

    const { data, error, count } = await query
      .range((page - 1) * limit, page * limit - 1);

    if (error) throw error;

    return {
      data: data || [],
      count: count || 0
    };
  } catch (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }
}

export async function getClientById(id: string): Promise<Client | null> {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error fetching client:', error);
    throw error;
  }
}

export async function createClient(data: CreateClientInput): Promise<Client> {
  try {
    const { data: client, error } = await supabase
      .from('clients')
      .insert([{
        ...data,
        postal_code: data.postalCode,
        active: true,
        user_id: (await supabase.auth.getUser()).data.user?.id
      }])
      .select()
      .single();

    if (error) throw error;

    return client;
  } catch (error) {
    console.error('Error creating client:', error);
    throw error;
  }
}

export async function updateClient(id: string, data: Partial<CreateClientInput>): Promise<Client> {
  try {
    const updateData = {
      ...data,
      postal_code: data.postalCode,
      updated_at: new Date().toISOString()
    };
    delete updateData.postalCode;

    const { data: client, error } = await supabase
      .from('clients')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return client;
  } catch (error) {
    console.error('Error updating client:', error);
    throw error;
  }
}

export async function deleteClient(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('clients')
      .update({ active: false })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting client:', error);
    throw error;
  }
}
import { supabase } from './supabase';

export interface Supplier {
  id?: string;
  nome: string;
  cnpj: string;
  telefone: string;
  email: string;
  contato: string;
  endereco: string;
  categorias: string[];
  observacoes?: string;
  created_at?: string;
}

export async function createSupplier(supplier: Omit<Supplier, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('fornecedores')
    .insert([supplier])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getSuppliers() {
  const { data, error } = await supabase
    .from('fornecedores')
    .select('*')
    .order('nome');

  if (error) throw error;
  return data;
}

export async function updateSupplier(id: string, supplier: Partial<Supplier>) {
  const { data, error } = await supabase
    .from('fornecedores')
    .update(supplier)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteSupplier(id: string) {
  const { error } = await supabase
    .from('fornecedores')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

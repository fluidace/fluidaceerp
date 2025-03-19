import { supabase } from './supabase';

export interface Employee {
  id: string;
  name: string;
  email: string | null;
  document: string;
  position: string;
  department: string;
  phone: string | null;
  address: string | null;
  salary: number | null;
  hire_date: string;
  status: 'Ativo' | 'Inativo' | 'Férias' | 'Licença';
  productivity: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface CreateEmployeeData {
  name: string;
  email?: string;
  document: string;
  position: string;
  department: string;
  phone?: string;
  address?: string;
  salary?: number;
  hire_date: string;
  status: 'Ativo' | 'Inativo' | 'Férias' | 'Licença';
  productivity?: number;
  notes?: string;
}

export async function createEmployee(data: CreateEmployeeData) {
  const { data: employee, error } = await supabase
    .from('employees')
    .insert([{
      ...data,
      user_id: (await supabase.auth.getUser()).data.user?.id
    }])
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      throw new Error('CPF já cadastrado');
    }
    throw error;
  }
  return employee;
}

export async function getEmployees() {
  const { data: employees, error } = await supabase
    .from('employees')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return employees;
}

export async function updateEmployee(id: string, data: Partial<CreateEmployeeData>) {
  const { data: employee, error } = await supabase
    .from('employees')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      throw new Error('CPF já cadastrado');
    }
    throw error;
  }
  return employee;
}

export async function deleteEmployee(id: string) {
  const { error } = await supabase
    .from('employees')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
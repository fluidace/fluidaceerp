export interface Employee {
  id: string;
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
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateEmployeeDTO {
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
  notes?: string;
}

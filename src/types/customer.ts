export interface Customer {
  id: string;
  name: string;
  document: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  type: 'Física' | 'Jurídica';
  status: 'Ativo' | 'Inativo' | 'VIP';
  notes: string | null;
  last_purchase: string | null;
  total_purchases: number;
  created_at: string;
  updated_at: string;
}

export interface CreateCustomerInput {
  name: string;
  document: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  type: 'Física' | 'Jurídica';
  status: 'Ativo' | 'Inativo' | 'VIP';
  notes?: string | null;
}

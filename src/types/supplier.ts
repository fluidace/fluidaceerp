export interface Supplier {
  id: string;
  nome: string;
  cnpj: string;
  telefone: string;
  email: string;
  contato: string;
  endereco: string;
  categorias: string[];
  observacoes?: string;
  created_at: string;
}

export type NewSupplier = Omit<Supplier, 'id' | 'created_at'>;

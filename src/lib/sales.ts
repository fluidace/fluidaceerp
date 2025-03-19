import { supabase } from './supabase';

export interface Sale {
  id: string;
  client_id: string;
  seller_id: string;
  total: number;
  discount: number;
  payment_method: string;
  payment_terms: string;
  status: 'Pendente' | 'Em andamento' | 'Concluída' | 'Cancelada';
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface SaleItem {
  id: string;
  sale_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface MonthlySalesData {
  currentMonth: number;
  previousMonth: number;
}

export async function getMonthlySalesData(): Promise<MonthlySalesData> {
  try {
    const now = new Date();
    const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const lastDayCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
    const firstDayPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
    const lastDayPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0).toISOString();

    const { data: currentMonthData, error: currentError } = await supabase
      .from('sales')
      .select('total')
      .gte('created_at', firstDayCurrentMonth)
      .lte('created_at', lastDayCurrentMonth);

    if (currentError) throw currentError;

    const { data: previousMonthData, error: previousError } = await supabase
      .from('sales')
      .select('total')
      .gte('created_at', firstDayPreviousMonth)
      .lte('created_at', lastDayPreviousMonth);

    if (previousError) throw previousError;

    const currentMonthTotal = currentMonthData?.reduce((acc, sale) => acc + (sale.total || 0), 0) || 0;
    const previousMonthTotal = previousMonthData?.reduce((acc, sale) => acc + (sale.total || 0), 0) || 0;

    return {
      currentMonth: currentMonthTotal,
      previousMonth: previousMonthTotal
    };
  } catch (error) {
    console.error('Error fetching monthly sales data:', error);
    throw error;
  }
}

export async function getSales(page: number = 1, limit: number = 10, filters?: {
  status?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}): Promise<{ data: Sale[]; count: number }> {
  try {
    let query = supabase
      .from('sales')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.startDate && filters?.endDate) {
      query = query
        .gte('created_at', filters.startDate)
        .lte('created_at', filters.endDate);
    }

    if (filters?.search) {
      query = query.or(`client_id.ilike.%${filters.search}%,id.ilike.%${filters.search}%`);
    }

    const { data, error, count } = await query
      .range((page - 1) * limit, page * limit - 1);

    if (error) throw error;

    return {
      data: data || [],
      count: count || 0
    };
  } catch (error) {
    console.error('Error fetching sales:', error);
    throw error;
  }
}

export async function createSale(data: Omit<Sale, 'id' | 'created_at' | 'updated_at'>, items: Omit<SaleItem, 'id' | 'sale_id'>[]): Promise<Sale> {
  try {
    const { data: sale, error: saleError } = await supabase
      .from('sales')
      .insert([{
        ...data,
        user_id: (await supabase.auth.getUser()).data.user?.id
      }])
      .select()
      .single();

    if (saleError) throw saleError;

    const saleItems = items.map(item => ({
      ...item,
      sale_id: sale.id
    }));

    const { error: itemsError } = await supabase
      .from('sale_items')
      .insert(saleItems);

    if (itemsError) throw itemsError;

    return sale;
  } catch (error) {
    console.error('Error creating sale:', error);
    throw error;
  }
}

export async function updateSaleStatus(id: string, status: Sale['status']): Promise<Sale> {
  try {
    const { data: sale, error } = await supabase
      .from('sales')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return sale;
  } catch (error) {
    console.error('Error updating sale status:', error);
    throw error;
  }
}

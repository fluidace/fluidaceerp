export interface SalesData {
  currentMonth: number;
  previousMonth: number;
}

export interface Sale {
  id: string;
  date: string;
  total: number;
  clientId: string;
  items: SaleItem[];
}

export interface SaleItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

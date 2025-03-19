import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { getMonthlySalesData } from '../lib/sales';

interface SalesState {
  currentMonth: number;
  previousMonth: number;
  isLoading: boolean;
  error: string | null;
}

const MonthlyTotalSales: React.FC = () => {
  const [salesData, setSalesData] = useState<SalesState>({
    currentMonth: 0,
    previousMonth: 0,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const data = await getMonthlySalesData();
        setSalesData({
          currentMonth: data.currentMonth,
          previousMonth: data.previousMonth,
          isLoading: false,
          error: null
        });
      } catch (error) {
        setSalesData(prev => ({
          ...prev,
          isLoading: false,
          error: 'Erro ao carregar dados de vendas'
        }));
        console.error('Error fetching sales data:', error);
      }
    };

    fetchSalesData();
  }, []);

  const calculatePercentageChange = () => {
    if (salesData.previousMonth === 0) return 0;
    return ((salesData.currentMonth - salesData.previousMonth) / salesData.previousMonth) * 100;
  };

  const percentageChange = calculatePercentageChange();
  const isPositiveChange = percentageChange >= 0;

  if (salesData.isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (salesData.error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-600">{salesData.error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm text-gray-500">Total de Vendas do Mês</h2>
          <p className="text-2xl font-bold">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(salesData.currentMonth)}
          </p>
          <div className="flex items-center mt-2">
            {isPositiveChange ? (
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span
              className={`text-sm ${
                isPositiveChange ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {percentageChange.toFixed(1)}% em relação ao mês anterior
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyTotalSales;

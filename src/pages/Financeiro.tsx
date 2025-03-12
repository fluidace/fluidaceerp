import React, { useState } from 'react';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Filter, Download, Plus, FileText, BellRing, CreditCard, Wallet, Ban as Bank, Receipt } from 'lucide-react';

const monthlyData = [
  { month: 'Jan', receitas: 50000, despesas: 35000 },
  { month: 'Fev', receitas: 65000, despesas: 40000 },
  { month: 'Mar', receitas: 45000, despesas: 38000 },
  { month: 'Abr', receitas: 70000, despesas: 42000 },
  { month: 'Mai', receitas: 85000, despesas: 48000 },
  { month: 'Jun', receitas: 75000, despesas: 45000 },
];

const expenseCategories = [
  { name: 'Operacional', value: 45 },
  { name: 'Marketing', value: 15 },
  { name: 'Pessoal', value: 25 },
  { name: 'Infraestrutura', value: 10 },
  { name: 'Outros', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const transactions = [
  {
    id: 1,
    description: 'Venda de Produtos',
    type: 'receita',
    value: 2500.00,
    date: '2024-03-20',
    status: 'Recebido',
    category: 'Vendas',
  },
  {
    id: 2,
    description: 'Aluguel',
    type: 'despesa',
    value: 3800.00,
    date: '2024-03-25',
    status: 'Pendente',
    category: 'Infraestrutura',
  },
  {
    id: 3,
    description: 'Serviços Prestados',
    type: 'receita',
    value: 1500.00,
    date: '2024-03-18',
    status: 'Recebido',
    category: 'Serviços',
  },
];

const Financeiro = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Gestão Financeira</h1>
            <p className="text-gray-500 mt-1">Controle completo das suas finanças</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              {theme === 'light' ? '🌙' : '☀️'} Modo {theme === 'light' ? 'Escuro' : 'Claro'}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
              <Plus size={20} /> Nova Transação
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
              <Download size={20} /> Exportar
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Saldo em Caixa</p>
                <h3 className="text-2xl font-bold">R$ 125.400</h3>
                <p className="text-sm text-green-500 flex items-center mt-2">
                  <TrendingUp size={16} className="mr-1" /> +12.5%
                </p>
              </div>
              <Wallet size={40} className="text-blue-500" />
            </div>
          </div>

          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Receitas do Mês</p>
                <h3 className="text-2xl font-bold">R$ 85.300</h3>
                <p className="text-sm text-green-500 flex items-center mt-2">
                  <TrendingUp size={16} className="mr-1" /> +8.2%
                </p>
              </div>
              <DollarSign size={40} className="text-blue-500" />
            </div>
          </div>

          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Despesas do Mês</p>
                <h3 className="text-2xl font-bold">R$ 42.800</h3>
                <p className="text-sm text-red-500 flex items-center mt-2">
                  <TrendingDown size={16} className="mr-1" /> -5.3%
                </p>
              </div>
              <Receipt size={40} className="text-blue-500" />
            </div>
          </div>

          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Contas a Receber</p>
                <h3 className="text-2xl font-bold">R$ 38.900</h3>
                <p className="text-sm text-yellow-500 flex items-center mt-2">
                  <Calendar size={16} className="mr-1" /> 8 pendentes
                </p>
              </div>
              <Bank size={40} className="text-blue-500" />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
            <h3 className="text-xl font-semibold mb-4">Fluxo de Caixa</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="receitas" fill="#10B981" name="Receitas" />
                  <Bar dataKey="despesas" fill="#EF4444" name="Despesas" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
            <h3 className="text-xl font-semibold mb-4">Distribuição de Despesas</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseCategories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {expenseCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg mb-8`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Transações Recentes</h3>
            <div className="flex gap-4">
              <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => setDateRange(update)}
                placeholderText="Filtrar por período"
                className="px-4 py-2 rounded-lg border border-gray-300"
              />
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                <Filter size={20} /> Filtros
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">Descrição</th>
                  <th className="text-left py-3">Categoria</th>
                  <th className="text-left py-3">Valor</th>
                  <th className="text-left py-3">Data</th>
                  <th className="text-left py-3">Status</th>
                  <th className="text-left py-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b">
                    <td className="py-3">{transaction.description}</td>
                    <td className="py-3">{transaction.category}</td>
                    <td className={`py-3 ${transaction.type === 'receita' ? 'text-green-500' : 'text-red-500'}`}>
                      {transaction.type === 'receita' ? '+' : '-'}R$ {transaction.value.toFixed(2)}
                    </td>
                    <td className="py-3">{format(new Date(transaction.date), 'dd/MM/yyyy')}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          transaction.status === 'Recebido'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <button className="text-blue-600 hover:text-blue-800">
                        <FileText size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alerts and Notifications */}
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
          <h3 className="text-xl font-semibold mb-4">Alertas Financeiros</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-yellow-50 text-yellow-800 rounded-lg">
              <BellRing size={24} />
              <div>
                <p className="font-medium">Contas a vencer esta semana</p>
                <p className="text-sm">3 pagamentos totalizam R$ 5.800,00</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-green-50 text-green-800 rounded-lg">
              <CreditCard size={24} />
              <div>
                <p className="font-medium">Recebimentos previstos</p>
                <p className="text-sm">5 recebimentos totalizam R$ 12.300,00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Financeiro;
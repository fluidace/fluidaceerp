import React, { useState } from 'react';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import {
  TrendingUp, TrendingDown, ShoppingCart, Users, FileText,
  Plus, Download, Filter, Calendar, Clock, CheckCircle2,
  XCircle, AlertCircle, DollarSign, Package, ChevronRight
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';

const salesData = [
  { month: 'Jan', vendas: 45000, meta: 50000 },
  { month: 'Fev', vendas: 52000, meta: 50000 },
  { month: 'Mar', vendas: 49000, meta: 50000 },
  { month: 'Abr', vendas: 63000, meta: 55000 },
  { month: 'Mai', vendas: 58000, meta: 55000 },
  { month: 'Jun', vendas: 72000, meta: 60000 },
];

const salesByCategory = [
  { name: 'Produtos', value: 45 },
  { name: 'Serviços', value: 30 },
  { name: 'Assinaturas', value: 25 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const recentOrders = [
  {
    id: 1,
    client: 'Empresa ABC Ltda',
    value: 12500.00,
    status: 'Aprovado',
    date: '2024-03-20',
    items: 5,
  },
  {
    id: 2,
    client: 'João Silva ME',
    value: 3800.00,
    status: 'Pendente',
    date: '2024-03-19',
    items: 2,
  },
  {
    id: 3,
    client: 'Tech Solutions S.A.',
    value: 8900.00,
    status: 'Em Análise',
    date: '2024-03-18',
    items: 3,
  },
  {
    id: 4,
    client: 'Maria Consultoria',
    value: 5400.00,
    status: 'Aprovado',
    date: '2024-03-17',
    items: 1,
  },
];

const topClients = [
  {
    name: 'Empresa ABC Ltda',
    totalPurchases: 158900.00,
    ordersCount: 12,
    lastPurchase: '2024-03-20',
  },
  {
    name: 'Tech Solutions S.A.',
    totalPurchases: 89500.00,
    ordersCount: 8,
    lastPurchase: '2024-03-18',
  },
  {
    name: 'João Silva ME',
    totalPurchases: 45800.00,
    ordersCount: 6,
    lastPurchase: '2024-03-19',
  },
];

const Vendas = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;
  const [activeTab, setActiveTab] = useState('pedidos');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Gestão de Vendas</h1>
            <p className="text-gray-500 mt-1">Controle seus pedidos e orçamentos</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              {theme === 'light' ? '🌙' : '☀️'} Modo {theme === 'light' ? 'Escuro' : 'Claro'}
            </button>
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                  <Plus size={20} /> Novo Pedido
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
                  <Dialog.Title className="text-xl font-bold mb-4">Novo Pedido</Dialog.Title>
                  <div className="space-y-4">
                    {/* Form fields would go here */}
                    <p className="text-gray-500">Formulário de novo pedido em desenvolvimento...</p>
                  </div>
                  <div className="mt-6 flex justify-end gap-4">
                    <Dialog.Close asChild>
                      <button className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors">
                        Cancelar
                      </button>
                    </Dialog.Close>
                    <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                      Criar Pedido
                    </button>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
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
                <p className="text-sm text-gray-500">Vendas do Mês</p>
                <h3 className="text-2xl font-bold">R$ 72.400</h3>
                <p className="text-sm text-green-500 flex items-center mt-2">
                  <TrendingUp size={16} className="mr-1" /> +15.3%
                </p>
              </div>
              <ShoppingCart size={40} className="text-blue-500" />
            </div>
          </div>

          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Ticket Médio</p>
                <h3 className="text-2xl font-bold">R$ 1.850</h3>
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
                <p className="text-sm text-gray-500">Pedidos do Mês</p>
                <h3 className="text-2xl font-bold">39</h3>
                <p className="text-sm text-red-500 flex items-center mt-2">
                  <TrendingDown size={16} className="mr-1" /> -2.5%
                </p>
              </div>
              <Package size={40} className="text-blue-500" />
            </div>
          </div>

          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Clientes Ativos</p>
                <h3 className="text-2xl font-bold">156</h3>
                <p className="text-sm text-green-500 flex items-center mt-2">
                  <TrendingUp size={16} className="mr-1" /> +12.8%
                </p>
              </div>
              <Users size={40} className="text-blue-500" />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
            <h3 className="text-xl font-semibold mb-4">Vendas vs Meta</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="vendas" fill="#10B981" name="Vendas" />
                  <Bar dataKey="meta" fill="#6366F1" name="Meta" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
            <h3 className="text-xl font-semibold mb-4">Vendas por Categoria</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={salesByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {salesByCategory.map((entry, index) => (
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

        {/* Tabs and Content */}
        <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
          <Tabs.List className="flex border-b border-gray-200 mb-6">
            <Tabs.Trigger
              value="pedidos"
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'pedidos'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Pedidos Recentes
            </Tabs.Trigger>
            <Tabs.Trigger
              value="clientes"
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'clientes'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Principais Clientes
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="pedidos">
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg mb-8`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Pedidos Recentes</h3>
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
                      <th className="text-left py-3">Cliente</th>
                      <th className="text-left py-3">Valor</th>
                      <th className="text-left py-3">Status</th>
                      <th className="text-left py-3">Data</th>
                      <th className="text-left py-3">Itens</th>
                      <th className="text-left py-3">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b">
                        <td className="py-3">{order.client}</td>
                        <td className="py-3">R$ {order.value.toFixed(2)}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              order.status === 'Aprovado'
                                ? 'bg-green-100 text-green-800'
                                : order.status === 'Pendente'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3">{format(new Date(order.date), 'dd/MM/yyyy')}</td>
                        <td className="py-3">{order.items}</td>
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
          </Tabs.Content>

          <Tabs.Content value="clientes">
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg mb-8`}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topClients.map((client) => (
                  <div key={client.name} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{client.name}</h4>
                        <p className="text-sm text-gray-500">
                          {client.ordersCount} pedidos
                        </p>
                      </div>
                      <ChevronRight className="text-gray-400" />
                    </div>
                    <div className="mt-4">
                      <p className="text-lg font-bold">
                        R$ {client.totalPurchases.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Última compra: {format(new Date(client.lastPurchase), 'dd/MM/yyyy')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
};

export default Vendas;
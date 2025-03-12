import React, { useState } from 'react';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import {
  ShoppingBag, TrendingUp, TrendingDown, Clock, FileText,
  Calendar, DollarSign, Truck, Package, Plus, Download,
  Filter, Search, Moon, Sun, CheckCircle, XCircle,
  AlertTriangle, MessageSquare, Upload, RefreshCw
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';

const purchaseData = [
  { month: 'Jan', compras: 45000, meta: 50000 },
  { month: 'Fev', compras: 52000, meta: 50000 },
  { month: 'Mar', compras: 49000, meta: 50000 },
  { month: 'Abr', compras: 63000, meta: 55000 },
  { month: 'Mai', compras: 58000, meta: 55000 },
  { month: 'Jun', compras: 72000, meta: 60000 },
];

const purchaseByCategory = [
  { name: 'Matéria-prima', value: 45 },
  { name: 'Equipamentos', value: 25 },
  { name: 'Suprimentos', value: 20 },
  { name: 'Serviços', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const purchaseOrders = [
  {
    id: 1,
    supplier: 'Tech Distribuidora',
    value: 12500.00,
    status: 'Entregue',
    paymentStatus: 'Pago',
    orderDate: '2024-03-20',
    deliveryDate: '2024-03-25',
    items: 5,
  },
  {
    id: 2,
    supplier: 'Suprimentos Express',
    value: 3800.00,
    status: 'Pendente',
    paymentStatus: 'Aguardando',
    orderDate: '2024-03-19',
    deliveryDate: '2024-03-30',
    items: 3,
  },
  {
    id: 3,
    supplier: 'Equipamentos Pro',
    value: 8900.00,
    status: 'Em Processamento',
    paymentStatus: 'Parcial',
    orderDate: '2024-03-18',
    deliveryDate: '2024-03-28',
    items: 2,
  },
];

const suppliers = [
  {
    id: 1,
    name: 'Tech Distribuidora',
    category: 'Eletrônicos',
    reliability: 98,
    deliveryTime: '3 dias',
    lastPurchase: '2024-03-20',
    totalPurchases: 158900.00,
  },
  {
    id: 2,
    name: 'Suprimentos Express',
    category: 'Suprimentos',
    reliability: 95,
    deliveryTime: '2 dias',
    lastPurchase: '2024-03-19',
    totalPurchases: 89500.00,
  },
  {
    id: 3,
    name: 'Equipamentos Pro',
    category: 'Equipamentos',
    reliability: 92,
    deliveryTime: '5 dias',
    lastPurchase: '2024-03-18',
    totalPurchases: 45800.00,
  },
];

const Compras = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;
  const [activeTab, setActiveTab] = useState('pedidos');
  const [searchTerm, setSearchTerm] = useState('');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Gestão de Compras</h1>
            <p className="text-gray-500 mt-1">Controle seus pedidos e fornecedores</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                  <Plus size={20} /> Novo Pedido
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                <Dialog.Content className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 w-full max-w-2xl`}>
                  <Dialog.Title className="text-xl font-bold mb-4">Novo Pedido de Compra</Dialog.Title>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Fornecedor</label>
                        <select className="w-full px-3 py-2 border rounded-lg">
                          {suppliers.map(supplier => (
                            <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Data do Pedido</label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Prazo de Entrega</label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Condição de Pagamento</label>
                        <select className="w-full px-3 py-2 border rounded-lg">
                          <option>À Vista</option>
                          <option>30 dias</option>
                          <option>60 dias</option>
                          <option>90 dias</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Produtos</label>
                      <div className="border rounded-lg p-4 space-y-4">
                        <div className="grid grid-cols-12 gap-4">
                          <div className="col-span-5">
                            <input
                              type="text"
                              placeholder="Produto"
                              className="w-full px-3 py-2 border rounded-lg"
                            />
                          </div>
                          <div className="col-span-2">
                            <input
                              type="number"
                              placeholder="Qtd"
                              className="w-full px-3 py-2 border rounded-lg"
                            />
                          </div>
                          <div className="col-span-3">
                            <input
                              type="number"
                              placeholder="Valor Unit."
                              className="w-full px-3 py-2 border rounded-lg"
                            />
                          </div>
                          <div className="col-span-2">
                            <button
                              type="button"
                              className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                              <Plus size={20} className="mx-auto" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Observações</label>
                      <textarea
                        className="w-full px-3 py-2 border rounded-lg"
                        rows={3}
                        placeholder="Informações adicionais"
                      />
                    </div>
                  </form>
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
                <p className="text-sm text-gray-500">Compras do Mês</p>
                <h3 className="text-2xl font-bold">R$ 72.400</h3>
                <p className="text-sm text-green-500 flex items-center mt-2">
                  <TrendingUp size={16} className="mr-1" /> +15.3%
                </p>
              </div>
              <ShoppingBag size={40} className="text-blue-500" />
            </div>
          </div>

          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pedidos Pendentes</p>
                <h3 className="text-2xl font-bold">12</h3>
                <p className="text-sm text-yellow-500 flex items-center mt-2">
                  <Clock size={16} className="mr-1" /> Em andamento
                </p>
              </div>
              <Package size={40} className="text-blue-500" />
            </div>
          </div>

          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Tempo Médio Entrega</p>
                <h3 className="text-2xl font-bold">3.5 dias</h3>
                <p className="text-sm text-green-500 flex items-center mt-2">
                  <TrendingDown size={16} className="mr-1" /> -0.5 dias
                </p>
              </div>
              <Truck size={40} className="text-blue-500" />
            </div>
          </div>

          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pagamentos Pendentes</p>
                <h3 className="text-2xl font-bold">R$ 38.900</h3>
                <p className="text-sm text-yellow-500 flex items-center mt-2">
                  <Calendar size={16} className="mr-1" /> 5 vencendo
                </p>
              </div>
              <DollarSign size={40} className="text-blue-500" />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
            <h3 className="text-xl font-semibold mb-4">Evolução das Compras</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={purchaseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="compras" stroke="#10B981" name="Compras" />
                  <Line type="monotone" dataKey="meta" stroke="#6366F1" name="Meta" strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
            <h3 className="text-xl font-semibold mb-4">Compras por Categoria</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={purchaseByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {purchaseByCategory.map((entry, index) => (
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
              Pedidos de Compra
            </Tabs.Trigger>
            <Tabs.Trigger
              value="fornecedores"
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'fornecedores'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Fornecedores
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="pedidos">
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg mb-8`}>
              <div className="flex justify-between items-center mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Buscar pedidos..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-4 ml-4">
                  <DatePicker
                    selectsRange={true}
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(update) => setDateRange(update)}
                    placeholderText="Filtrar por período"
                    className="px-4 py-2 rounded-lg border"
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
                      <th className="text-left py-3">Fornecedor</th>
                      <th className="text-left py-3">Valor</th>
                      <th className="text-left py-3">Status</th>
                      <th className="text-left py-3">Pagamento</th>
                      <th className="text-left py-3">Data do Pedido</th>
                      <th className="text-left py-3">Prazo de Entrega</th>
                      <th className="text-left py-3">Itens</th>
                      <th className="text-left py-3">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchaseOrders.map((order) => (
                      <tr key={order.id} className="border-b">
                        <td className="py-3">{order.supplier}</td>
                        <td className="py-3">R$ {order.value.toFixed(2)}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              order.status === 'Entregue'
                                ? 'bg-green-100 text-green-800'
                                : order.status === 'Pendente'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              order.paymentStatus === 'Pago'
                                ? 'bg-green-100 text-green-800'
                                : order.paymentStatus === 'Parcial'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3">{format(new Date(order.orderDate), 'dd/MM/yyyy')}</td>
                        <td className="py-3">{format(new Date(order.deliveryDate), 'dd/MM/yyyy')}</td>
                        <td className="py-3">{order.items}</td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            <button className="text-blue-600 hover:text-blue-800">
                              <FileText size={18} />
                            </button>
                            <button className="text-green-600 hover:text-green-800">
                              <Upload size={18} />
                            </button>
                            <button className="text-purple-600 hover:text-purple-800">
                              <MessageSquare size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Tabs.Content>

          <Tabs.Content value="fornecedores">
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg mb-8`}>
              <div className="flex justify-between items-center mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Buscar fornecedores..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border"
                  />
                </div>
                <div className="flex gap-4 ml-4">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                    <Plus size={20} /> Novo Fornecedor
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {suppliers.map((supplier) => (
                  <div
                    key={supplier.id}
                    className={`${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                    } p-4 rounded-lg`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{supplier.name}</h4>
                        <p className="text-sm text-gray-500">{supplier.category}</p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          supplier.reliability >= 95
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {supplier.reliability}% Confiabilidade
                      </span>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">
                        Tempo médio de entrega: {supplier.deliveryTime}
                      </p>
                      <p className="text-sm text-gray-500">
                        Última compra: {format(new Date(supplier.lastPurchase), 'dd/MM/yyyy')}
                      </p>
                      <p className="text-lg font-bold mt-2">
                        R$ {supplier.totalPurchases.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">Total em compras</p>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Fazer Pedido
                      </button>
                      <button className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                        <MessageSquare size={18} />
                      </button>
                      <button className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                        <RefreshCw size={18} />
                      </button>
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

export default Compras;
import React, { useState } from 'react';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import {
  Package, PackagePlus, Download, Filter, Search, Truck,
  TrendingUp, TrendingDown, AlertTriangle, BarChart2,
  FileText, Printer, Settings, Moon, Sun, Plus, Edit,
  ArrowUpCircle, ArrowDownCircle, RefreshCw, Archive
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import * as Select from '@radix-ui/react-select';

const stockMovement = [
  { month: 'Jan', entradas: 450, saidas: 380 },
  { month: 'Fev', entradas: 520, saidas: 420 },
  { month: 'Mar', entradas: 480, saidas: 460 },
  { month: 'Abr', entradas: 550, saidas: 500 },
  { month: 'Mai', entradas: 620, saidas: 580 },
  { month: 'Jun', entradas: 580, saidas: 540 },
];

const stockDistribution = [
  { name: 'Eletrônicos', value: 35 },
  { name: 'Móveis', value: 25 },
  { name: 'Acessórios', value: 20 },
  { name: 'Outros', value: 20 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const products = [
  {
    id: 1,
    name: 'Notebook Dell Inspiron',
    sku: 'NOT-DEL-001',
    category: 'Eletrônicos',
    quantity: 15,
    minQuantity: 10,
    price: 3599.90,
    status: 'Em estoque',
    lastMovement: '2024-03-20',
  },
  {
    id: 2,
    name: 'Mesa de Escritório',
    sku: 'MOV-MES-001',
    category: 'Móveis',
    quantity: 8,
    minQuantity: 15,
    price: 899.90,
    status: 'Baixo estoque',
    lastMovement: '2024-03-19',
  },
  {
    id: 3,
    name: 'Mouse Wireless',
    sku: 'PER-MOU-001',
    category: 'Acessórios',
    quantity: 45,
    minQuantity: 20,
    price: 89.90,
    status: 'Em estoque',
    lastMovement: '2024-03-18',
  },
];

const stockMovements = [
  {
    id: 1,
    type: 'entrada',
    product: 'Notebook Dell Inspiron',
    quantity: 10,
    date: '2024-03-20',
    user: 'João Silva',
    reason: 'Compra de fornecedor',
  },
  {
    id: 2,
    type: 'saida',
    product: 'Mesa de Escritório',
    quantity: 2,
    date: '2024-03-19',
    user: 'Maria Santos',
    reason: 'Venda',
  },
  {
    id: 3,
    type: 'ajuste',
    product: 'Mouse Wireless',
    quantity: -3,
    date: '2024-03-18',
    user: 'Pedro Costa',
    reason: 'Inventário',
  },
];

const suppliers = [
  {
    id: 1,
    name: 'Tech Distribuidora',
    products: ['Notebook Dell Inspiron', 'Mouse Wireless'],
    lastPurchase: '2024-03-15',
    contact: '(11) 99999-9999',
  },
  {
    id: 2,
    name: 'Móveis Corp',
    products: ['Mesa de Escritório'],
    lastPurchase: '2024-03-10',
    contact: '(11) 88888-8888',
  },
];

const Estoque = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('produtos');
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
            <h1 className="text-2xl font-bold">Gestão de Estoque</h1>
            <p className="text-gray-500 mt-1">Controle seu inventário</p>
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
                  <PackagePlus size={20} /> Novo Produto
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                <Dialog.Content className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 w-full max-w-2xl`}>
                  <Dialog.Title className="text-xl font-bold mb-4">Cadastrar Novo Produto</Dialog.Title>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Nome do Produto</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border rounded-lg"
                          placeholder="Nome do produto"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">SKU</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border rounded-lg"
                          placeholder="Código SKU"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Categoria</label>
                        <select className="w-full px-3 py-2 border rounded-lg">
                          <option>Eletrônicos</option>
                          <option>Móveis</option>
                          <option>Acessórios</option>
                          <option>Outros</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Fornecedor</label>
                        <select className="w-full px-3 py-2 border rounded-lg">
                          {suppliers.map(supplier => (
                            <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Preço de Compra</label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border rounded-lg"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Preço de Venda</label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border rounded-lg"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Quantidade Mínima</label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border rounded-lg"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Quantidade Inicial</label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border rounded-lg"
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Descrição</label>
                      <textarea
                        className="w-full px-3 py-2 border rounded-lg"
                        rows={3}
                        placeholder="Descrição do produto"
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
                      Salvar Produto
                    </button>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
              <Download size={20} /> Exportar
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
              <Printer size={20} /> Etiquetas
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total de Produtos</p>
                <h3 className="text-2xl font-bold">1.234</h3>
                <p className="text-sm text-green-500 flex items-center mt-2">
                  <TrendingUp size={16} className="mr-1" /> +8.1%
                </p>
              </div>
              <Package size={40} className="text-blue-500" />
            </div>
          </div>

          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Valor em Estoque</p>
                <h3 className="text-2xl font-bold">R$ 284.500</h3>
                <p className="text-sm text-green-500 flex items-center mt-2">
                  <TrendingUp size={16} className="mr-1" /> +12.5%
                </p>
              </div>
              <BarChart2 size={40} className="text-blue-500" />
            </div>
          </div>

          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Produtos em Baixa</p>
                <h3 className="text-2xl font-bold">23</h3>
                <p className="text-sm text-red-500 flex items-center mt-2">
                  <AlertTriangle size={16} className="mr-1" /> Atenção
                </p>
              </div>
              <AlertTriangle size={40} className="text-yellow-500" />
            </div>
          </div>

          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Fornecedores</p>
                <h3 className="text-2xl font-bold">45</h3>
                <p className="text-sm text-green-500 flex items-center mt-2">
                  <TrendingUp size={16} className="mr-1" /> +3.2%
                </p>
              </div>
              <Truck size={40} className="text-blue-500" />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
            <h3 className="text-xl font-semibold mb-4">Movimentação de Estoque</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stockMovement}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="entradas" fill="#10B981" name="Entradas" />
                  <Bar dataKey="saidas" fill="#EF4444" name="Saídas" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
            <h3 className="text-xl font-semibold mb-4">Distribuição por Categoria</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stockDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {stockDistribution.map((entry, index) => (
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
              value="produtos"
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'produtos'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Produtos
            </Tabs.Trigger>
            <Tabs.Trigger
              value="movimentacoes"
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'movimentacoes'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Movimentações
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

          <Tabs.Content value="produtos">
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg mb-8`}>
              <div className="flex justify-between items-center mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Buscar produtos..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-4 ml-4">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                    <Filter size={20} /> Filtros
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3">Produto</th>
                      <th className="text-left py-3">SKU</th>
                      <th className="text-left py-3">Categoria</th>
                      <th className="text-left py-3">Quantidade</th>
                      <th className="text-left py-3">Preço</th>
                      <th className="text-left py-3">Status</th>
                      <th className="text-left py-3">Última Movimentação</th>
                      <th className="text-left py-3">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b">
                        <td className="py-3">{product.name}</td>
                        <td className="py-3">{product.sku}</td>
                        <td className="py-3">{product.category}</td>
                        <td className="py-3">
                          <div className="flex items-center">
                            {product.quantity}
                            {product.quantity <= product.minQuantity && (
                              <AlertTriangle size={16} className="ml-2 text-yellow-500" />
                            )}
                          </div>
                        </td>
                        <td className="py-3">R$ {product.price.toFixed(2)}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              product.status === 'Em estoque'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {product.status}
                          </span>
                        </td>
                        <td className="py-3">{format(new Date(product.lastMovement), 'dd/MM/yyyy')}</td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            <button className="text-blue-600 hover:text-blue-800">
                              <Edit size={18} />
                            </button>
                            <button className="text-green-600 hover:text-green-800">
                              <ArrowUpCircle size={18} />
                            </button>
                            <button className="text-red-600 hover:text-red-800">
                              <ArrowDownCircle size={18} />
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

          <Tabs.Content value="movimentacoes">
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg mb-8`}>
              <div className="flex justify-between items-center mb-6">
                <DatePicker
                  selectsRange={true}
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(update) => setDateRange(update)}
                  placeholderText="Filtrar por período"
                  className="px-4 py-2 rounded-lg border"
                />
                <div className="flex gap-4">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                    <ArrowUpCircle size={20} /> Entrada
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                    <ArrowDownCircle size={20} /> Saída
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                    <RefreshCw size={20} /> Ajuste
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3">Tipo</th>
                      <th className="text-left py-3">Produto</th>
                      <th className="text-left py-3">Quantidade</th>
                      <th className="text-left py-3">Data</th>
                      <th className="text-left py-3">Usuário</th>
                      <th className="text-left py-3">Motivo</th>
                      <th className="text-left py-3">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockMovements.map((movement) => (
                      <tr key={movement.id} className="border-b">
                        <td className="py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              movement.type === 'entrada'
                                ? 'bg-green-100 text-green-800'
                                : movement.type === 'saida'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {movement.type.charAt(0).toUpperCase() + movement.type.slice(1)}
                          </span>
                        </td>
                        <td className="py-3">{movement.product}</td>
                        <td className="py-3">{movement.quantity}</td>
                        <td className="py-3">{format(new Date(movement.date), 'dd/MM/yyyy')}</td>
                        <td className="py-3">{movement.user}</td>
                        <td className="py-3">{movement.reason}</td>
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
                        <p className="text-sm text-gray-500">{supplier.products.length} produtos</p>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800">
                        <Edit size={18} />
                      </button>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">
                        Última compra: {format(new Date(supplier.lastPurchase), 'dd/MM/yyyy')}
                      </p>
                      <p className="text-sm text-gray-500">
                        Contato: {supplier.contact}
                      </p>
                    </div>
                    <div className="mt-4">
                      <h5 className="text-sm font-medium mb-2">Produtos:</h5>
                      <div className="flex flex-wrap gap-2">
                        {supplier.products.map((product, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                          >
                            {product}
                          </span>
                        ))}
                      </div>
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

export default Estoque;
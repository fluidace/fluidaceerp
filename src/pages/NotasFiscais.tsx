import React, { useState } from 'react';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import {
  FileText, TrendingUp, TrendingDown, AlertTriangle, Download,
  Filter, Search, Moon, Sun, Plus, CheckCircle2, XCircle,
  Upload, MessageSquare, Printer, DollarSign, Calendar,
  RefreshCw, FileCheck, FileX, Clock
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';

const invoiceData = [
  { month: 'Jan', emitidas: 45, canceladas: 2 },
  { month: 'Fev', emitidas: 52, canceladas: 1 },
  { month: 'Mar', emitidas: 48, canceladas: 3 },
  { month: 'Abr', emitidas: 63, canceladas: 2 },
  { month: 'Mai', emitidas: 58, canceladas: 1 },
  { month: 'Jun', emitidas: 72, canceladas: 4 },
];

const invoiceByType = [
  { name: 'Produtos (NF-e)', value: 65 },
  { name: 'Serviços (NFS-e)', value: 35 },
];

const COLORS = ['#0088FE', '#00C49F'];

const invoices = [
  {
    id: 1,
    number: '000000123',
    type: 'NF-e',
    client: 'Tech Solutions Ltda',
    value: 12500.00,
    status: 'Emitida',
    issueDate: '2024-03-20',
    items: 5,
  },
  {
    id: 2,
    number: '000000124',
    type: 'NFS-e',
    client: 'João Silva ME',
    value: 3800.00,
    status: 'Pendente',
    issueDate: '2024-03-19',
    items: 1,
  },
  {
    id: 3,
    number: '000000125',
    type: 'NF-e',
    client: 'Maria Consultoria',
    value: 8900.00,
    status: 'Rejeitada',
    issueDate: '2024-03-18',
    items: 3,
  },
];

const NotasFiscais = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;
  const [activeTab, setActiveTab] = useState('emitidas');
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
            <h1 className="text-2xl font-bold">Gestão de Notas Fiscais</h1>
            <p className="text-gray-500 mt-1">Emissão e controle de NF-e e NFS-e</p>
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
                  <Plus size={20} /> Nova Nota Fiscal
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                <Dialog.Content className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 w-full max-w-2xl`}>
                  <Dialog.Title className="text-xl font-bold mb-4">Emitir Nova Nota Fiscal</Dialog.Title>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Tipo de Nota</label>
                        <select className="w-full px-3 py-2 border rounded-lg">
                          <option value="nfe">NF-e (Produtos)</option>
                          <option value="nfse">NFS-e (Serviços)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Cliente</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border rounded-lg"
                          placeholder="Nome/Razão Social"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">CPF/CNPJ</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border rounded-lg"
                          placeholder="000.000.000-00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Data de Emissão</label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Itens</label>
                      <div className="border rounded-lg p-4 space-y-4">
                        <div className="grid grid-cols-12 gap-4">
                          <div className="col-span-4">
                            <input
                              type="text"
                              placeholder="Descrição"
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
                          <div className="col-span-2">
                            <input
                              type="number"
                              placeholder="Valor Unit."
                              className="w-full px-3 py-2 border rounded-lg"
                            />
                          </div>
                          <div className="col-span-2">
                            <input
                              type="number"
                              placeholder="Alíquota"
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
                      Emitir Nota
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
                <p className="text-sm text-gray-500">Notas Emitidas (Mês)</p>
                <h3 className="text-2xl font-bold">72</h3>
                <p className="text-sm text-green-500 flex items-center mt-2">
                  <TrendingUp size={16} className="mr-1" /> +15.3%
                </p>
              </div>
              <FileCheck size={40} className="text-blue-500" />
            </div>
          </div>

          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Valor Total Faturado</p>
                <h3 className="text-2xl font-bold">R$ 285.400</h3>
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
                <p className="text-sm text-gray-500">Notas Rejeitadas</p>
                <h3 className="text-2xl font-bold">3</h3>
                <p className="text-sm text-red-500 flex items-center mt-2">
                  <AlertTriangle size={16} className="mr-1" /> Necessita atenção
                </p>
              </div>
              <FileX size={40} className="text-red-500" />
            </div>
          </div>

          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Notas Pendentes</p>
                <h3 className="text-2xl font-bold">5</h3>
                <p className="text-sm text-yellow-500 flex items-center mt-2">
                  <Clock size={16} className="mr-1" /> Aguardando
                </p>
              </div>
              <RefreshCw size={40} className="text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
            <h3 className="text-xl font-semibold mb-4">Notas Fiscais por Mês</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={invoiceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="emitidas" fill="#10B981" name="Emitidas" />
                  <Bar dataKey="canceladas" fill="#EF4444" name="Canceladas" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
            <h3 className="text-xl font-semibold mb-4">Distribuição por Tipo</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={invoiceByType}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {invoiceByType.map((entry, index) => (
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
              value="emitidas"
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'emitidas'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Notas Fiscais Emitidas
            </Tabs.Trigger>
            <Tabs.Trigger
              value="pendentes"
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'pendentes'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Notas Pendentes
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="emitidas">
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg mb-8`}>
              <div className="flex justify-between items-center mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Buscar notas fiscais..."
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
                      <th className="text-left py-3">Número</th>
                      <th className="text-left py-3">Tipo</th>
                      <th className="text-left py-3">Cliente</th>
                      <th className="text-left py-3">Valor</th>
                      <th className="text-left py-3">Status</th>
                      <th className="text-left py-3">Data de Emissão</th>
                      <th className="text-left py-3">Itens</th>
                      <th className="text-left py-3">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="border-b">
                        <td className="py-3">{invoice.number}</td>
                        <td className="py-3">{invoice.type}</td>
                        <td className="py-3">{invoice.client}</td>
                        <td className="py-3">R$ {invoice.value.toFixed(2)}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              invoice.status === 'Emitida'
                                ? 'bg-green-100 text-green-800'
                                : invoice.status === 'Pendente'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {invoice.status}
                          </span>
                        </td>
                        <td className="py-3">{format(new Date(invoice.issueDate), 'dd/MM/yyyy')}</td>
                        <td className="py-3">{invoice.items}</td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            <button className="text-blue-600 hover:text-blue-800">
                              <FileText size={18} />
                            </button>
                            <button className="text-green-600 hover:text-green-800">
                              <Download size={18} />
                            </button>
                            <button className="text-purple-600 hover:text-purple-800">
                              <Printer size={18} />
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

          <Tabs.Content value="pendentes">
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg mb-8`}>
              <div className="p-8 text-center">
                <Clock className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Nenhuma nota fiscal pendente
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Todas as notas fiscais foram processadas com sucesso.
                </p>
              </div>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
};

export default NotasFiscais;
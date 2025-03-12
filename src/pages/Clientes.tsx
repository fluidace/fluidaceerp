import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import {
  Users, UserPlus, Download, Filter, Search, Phone, Mail,
  MapPin, Tag, TrendingUp, TrendingDown, MessageSquare,
  FileText, Star, AlertTriangle, Clock, ChevronRight,
  Settings, Moon, Sun
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import { createCustomer, getCustomers, Customer } from '../lib/customers';

const customerDistribution = [
  { name: 'VIP', value: 15 },
  { name: 'Recorrentes', value: 45 },
  { name: 'Novos', value: 25 },
  { name: 'Inativos', value: 15 },
];

const COLORS = ['#FF8042', '#00C49F', '#0088FE', '#FFBB28'];

const Clientes = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('lista');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setIsLoading(true);
      const data = await getCustomers();
      setCustomers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar clientes');
      console.error('Error loading customers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCustomer = async (formData: any) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const newCustomer = await createCustomer({
        name: formData.name,
        email: formData.email,
        document: formData.document,
        type: formData.type,
        phone: formData.phone,
        address: formData.address,
        notes: formData.notes,
        status: formData.status
      });

      setCustomers(prev => [newCustomer, ...prev]);
      return true; // Success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar cliente');
      console.error('Error creating customer:', err);
      return false; // Error
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Gestão de Clientes</h1>
            <p className="text-gray-500 mt-1">Gerencie sua carteira de clientes</p>
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
                  <UserPlus size={20} /> Novo Cliente
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                <Dialog.Content className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 w-full max-w-2xl`}>
                  <Dialog.Title className="text-xl font-bold mb-4">Cadastrar Novo Cliente</Dialog.Title>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const formData = new FormData(form);
                    const data = Object.fromEntries(formData);
                    
                    const success = await handleCreateCustomer(data);
                    if (success) {
                      form.reset();
                      // Close the dialog
                      const closeButton = form.querySelector('[aria-label="Close"]');
                      if (closeButton instanceof HTMLButtonElement) {
                        closeButton.click();
                      }
                    }
                  }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Nome/Razão Social</label>
                        <input
                          type="text"
                          name="name"
                          required
                          className="w-full px-3 py-2 border rounded-lg"
                          placeholder="Nome completo"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">CPF/CNPJ</label>
                        <input
                          type="text"
                          name="document"
                          className="w-full px-3 py-2 border rounded-lg"
                          placeholder="000.000.000-00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">E-mail</label>
                        <input
                          type="email"
                          name="email"
                          className="w-full px-3 py-2 border rounded-lg"
                          placeholder="email@exemplo.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Telefone</label>
                        <input
                          type="tel"
                          name="phone"
                          className="w-full px-3 py-2 border rounded-lg"
                          placeholder="(00) 00000-0000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Tipo</label>
                        <select
                          name="type"
                          className="w-full px-3 py-2 border rounded-lg"
                        >
                          <option value="Física">Pessoa Física</option>
                          <option value="Jurídica">Pessoa Jurídica</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Status</label>
                        <select
                          name="status"
                          className="w-full px-3 py-2 border rounded-lg"
                        >
                          <option value="Ativo">Ativo</option>
                          <option value="Inativo">Inativo</option>
                          <option value="VIP">VIP</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium mb-1">Endereço</label>
                      <input
                        type="text"
                        name="address"
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="Rua, número, complemento"
                      />
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium mb-1">Observações</label>
                      <textarea
                        name="notes"
                        className="w-full px-3 py-2 border rounded-lg"
                        rows={3}
                        placeholder="Informações adicionais"
                      />
                    </div>
                    <div className="mt-6 flex justify-end gap-4">
                      <Dialog.Close asChild>
                        <button
                          type="button"
                          className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                        >
                          Cancelar
                        </button>
                      </Dialog.Close>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {isLoading ? 'Salvando...' : 'Salvar Cliente'}
                      </button>
                    </div>
                  </form>
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
                <p className="text-sm text-gray-500">Total de Clientes</p>
                <h3 className="text-2xl font-bold">1.256</h3>
                <p className="text-sm text-green-500 flex items-center mt-2">
                  <TrendingUp size={16} className="mr-1" /> +12.5%
                </p>
              </div>
              <Users size={40} className="text-blue-500" />
            </div>
          </div>

          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Clientes Ativos</p>
                <h3 className="text-2xl font-bold">892</h3>
                <p className="text-sm text-green-500 flex items-center mt-2">
                  <TrendingUp size={16} className="mr-1" /> +8.2%
                </p>
              </div>
              <Star size={40} className="text-blue-500" />
            </div>
          </div>

          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Ticket Médio</p>
                <h3 className="text-2xl font-bold">R$ 1.850</h3>
                <p className="text-sm text-red-500 flex items-center mt-2">
                  <TrendingDown size={16} className="mr-1" /> -2.5%
                </p>
              </div>
              <FileText size={40} className="text-blue-500" />
            </div>
          </div>

          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Clientes Inativos</p>
                <h3 className="text-2xl font-bold">364</h3>
                <p className="text-sm text-yellow-500 flex items-center mt-2">
                  <AlertTriangle size={16} className="mr-1" /> +5.8%
                </p>
              </div>
              <Clock size={40} className="text-blue-500" />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
            <h3 className="text-xl font-semibold mb-4">Distribuição de Clientes</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={customerDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {customerDistribution.map((entry, index) => (
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
              value="lista"
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'lista'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Lista de Clientes
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="lista">
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg mb-8`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3">Cliente</th>
                      <th className="text-left py-3">Tipo</th>
                      <th className="text-left py-3">Documento</th>
                      <th className="text-left py-3">Status</th>
                      <th className="text-left py-3">Última Compra</th>
                      <th className="text-left py-3">Total em Compras</th>
                      <th className="text-left py-3">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer) => (
                      <tr key={customer.id} className="border-b">
                        <td className="py-3">{customer.name}</td>
                        <td className="py-3">{customer.type}</td>
                        <td className="py-3">{customer.document}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              customer.status === 'Ativo'
                                ? 'bg-green-100 text-green-800'
                                : customer.status === 'VIP'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {customer.status}
                          </span>
                        </td>
                        <td className="py-3">{customer.last_purchase ? format(new Date(customer.last_purchase), 'dd/MM/yyyy') : '-'}</td>
                        <td className="py-3">R$ {customer.total_purchases.toFixed(2)}</td>
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
        </Tabs.Root>
      </div>
    </div>
  );
};

export default Clientes;
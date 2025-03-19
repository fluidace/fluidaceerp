import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { ptBR } from 'date-fns/locale';
import {
  Users, Search, Filter, Plus, X,
  ArrowUpRight, ArrowDownRight,
  DollarSign, Star, UserCheck
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import ClientForm from '../components/ClientForm';
import { createCustomer, getCustomers, Customer, CustomerFilters } from '../lib/customers';

const customerData = [
  { month: 'Jan', ativos: 45, inativos: 2 },
  { month: 'Fev', ativos: 52, inativos: 1 },
  { month: 'Mar', ativos: 48, inativos: 3 },
  { month: 'Abr', ativos: 63, inativos: 2 },
  { month: 'Mai', ativos: 58, inativos: 1 },
  { month: 'Jun', ativos: 72, inativos: 4 },
];

const customerByType = [
  { name: 'Pessoa Física', value: 65 },
  { name: 'Pessoa Jurídica', value: 35 },
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

interface Address {
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

interface ClientDetails extends Omit<Customer, 'address' | 'createdAt' | 'status' | 'updatedAt'> {
  id: string;
  address: Address;
  createdAt: string;
  updatedAt: string;
  status: 'ativo' | 'inativo' | 'vip';
  lastPurchase?: string;
  totalPurchases: number;
  averageTicket: number;
  recentTransactions: {
    id: string;
    date: string;
    description: string;
    value: number;
    status: 'concluida' | 'andamento' | 'cancelada';
  }[];
}

const mockClients: ClientDetails[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '(11) 98765-4321',
    type: 'pf',
    document: '123.456.789-00',
    status: 'ativo',
    address: {
      street: 'Rua das Flores',
      number: '123',
      complement: 'Apto 45',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567'
    },
    createdAt: '2025-01-15',
    updatedAt: '2025-01-15',
    lastPurchase: '2025-03-10',
    totalPurchases: 12,
    averageTicket: 850.75,
    recentTransactions: [
      {
        id: '1',
        date: '2025-03-10',
        description: 'Compra de Equipamentos',
        value: 3750.00,
        status: 'concluida'
      },
      {
        id: '2',
        date: '2025-02-25',
        description: 'Serviço de Manutenção',
        value: 450.00,
        status: 'concluida'
      }
    ]
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria.santos@email.com',
    phone: '(11) 98765-4322',
    type: 'pj',
    document: '12.345.678/0001-90',
    status: 'ativo',
    address: {
      street: 'Av. Paulista',
      number: '1000',
      complement: 'Sala 1010',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100'
    },
    createdAt: '2024-12-01',
    updatedAt: '2024-12-01',
    lastPurchase: '2025-03-13',
    totalPurchases: 8,
    averageTicket: 2400.50,
    recentTransactions: [
      {
        id: '1',
        date: '2025-03-13',
        description: 'Compra de Monitores',
        value: 2400.00,
        status: 'andamento'
      }
    ]
  }
];

const Clientes = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientDetails | null>(null);
  const [filters, setFilters] = useState<CustomerFilters>({
    status: undefined,
    type: undefined,
    startDate: undefined,
    endDate: undefined,
    searchTerm: undefined
  });

  const handleFilterChange = (field: string, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    loadCustomers();
  }, [filters]);

  const loadCustomers = async () => {
    try {
      const data = await getCustomers(filters);
      setCustomers(data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  };

  const handleCreateCustomer = async (formData: any) => {
    try {
      await createCustomer(formData);
      await loadCustomers();
      return true;
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      return false;
    }
  };

  const handleCloseDialog = () => {
    // Função vazia apenas para satisfazer a prop onCancel
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-400">
      {/* Header Fixo */}
      <header className="sticky top-0 z-10 backdrop-blur-sm bg-opacity-90">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-blue-100 rounded-xl">
                <Users size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Clientes</h1>
                <p className="text-sm text-gray-500">Gestão de clientes e relacionamentos</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Dialog.Root>
                <Dialog.Trigger asChild>
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    <Plus size={20} />
                    <span className="font-medium">Novo Cliente</span>
                  </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold">Novo Cliente</h2>
                        <Dialog.Close asChild>
                          <button className="text-gray-400 hover:text-gray-500">
                            <X size={20} />
                          </button>
                        </Dialog.Close>
                      </div>
                      
                      <ClientForm onSubmit={handleCreateCustomer} onCancel={handleCloseDialog} />
                    </div>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-8">
        {/* Tabs */}
        <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
          <Tabs.List className="flex gap-1 p-1 mb-6 w-fit bg-gray-100 rounded-lg">
            <Tabs.Trigger
              value="overview"
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'overview'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Visão Geral
            </Tabs.Trigger>
            <Tabs.Trigger
              value="customers"
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'customers'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Clientes
            </Tabs.Trigger>
            <Tabs.Trigger
              value="reports"
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'reports'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Relatórios
            </Tabs.Trigger>
          </Tabs.List>

          {/* Conteúdo das Tabs */}
          <Tabs.Content value="overview" className="space-y-6">
            {/* Cards de Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Total de Clientes</span>
                  <span className="p-2 bg-blue-100 rounded-lg">
                    <Users size={20} className="text-blue-600" />
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-2xl font-bold">{customers.length}</span>
                  <span className="text-sm text-gray-500 ml-2">clientes</span>
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <ArrowUpRight size={16} className="text-green-500" />
                  <span className="text-green-500 font-medium">12%</span>
                  <span className="text-gray-500 ml-2">vs. mês anterior</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Faturamento Médio</span>
                  <span className="p-2 bg-green-100 rounded-lg">
                    <DollarSign size={20} className="text-green-600" />
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-2xl font-bold">R$ 12.450</span>
                  <span className="text-sm text-gray-500 ml-2">por cliente</span>
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <ArrowUpRight size={16} className="text-green-500" />
                  <span className="text-green-500 font-medium">8%</span>
                  <span className="text-gray-500 ml-2">vs. mês anterior</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Clientes VIP</span>
                  <span className="p-2 bg-amber-100 rounded-lg">
                    <Star size={20} className="text-amber-600" />
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-2xl font-bold">
                    {customers.filter(c => c.status === 'vip').length}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">clientes</span>
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <ArrowUpRight size={16} className="text-green-500" />
                  <span className="text-green-500 font-medium">5%</span>
                  <span className="text-gray-500 ml-2">vs. mês anterior</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Taxa de Retenção</span>
                  <span className="p-2 bg-purple-100 rounded-lg">
                    <UserCheck size={20} className="text-purple-600" />
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-2xl font-bold">94%</span>
                  <span className="text-sm text-gray-500 ml-2">média</span>
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <ArrowDownRight size={16} className="text-red-500" />
                  <span className="text-red-500 font-medium">2%</span>
                  <span className="text-gray-500 ml-2">vs. meta</span>
                </div>
              </div>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-base font-medium mb-4">Evolução de Clientes</h3>
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={customerData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="month" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip 
                        formatter={(value: number) => `${value} clientes`}
                        labelStyle={{ color: '#111827' }}
                        contentStyle={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.5rem' }}
                      />
                      <Legend />
                      <Bar 
                        dataKey="ativos" 
                        name="Ativos" 
                        fill="#10B981"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar 
                        dataKey="inativos" 
                        name="Inativos" 
                        fill="#EF4444"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-base font-medium mb-4">Distribuição por Tipo</h3>
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={customerByType}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#10B981"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {customerByType.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value} clientes`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </Tabs.Content>

          <Tabs.Content value="customers" className="space-y-6">
            {/* Filtros e Busca */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar clientes..."
                    className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                  <Filter size={20} className="text-gray-500" />
                </button>
              </div>

              <div className="flex items-center gap-4">
                <DatePicker
                  selectsRange={true}
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(update) => {
                    setDateRange(update);
                    handleFilterChange('startDate', update[0]);
                    handleFilterChange('endDate', update[1]);
                  }}
                  placeholderText="Selecione o período"
                  className="px-3 py-2 rounded-lg border border-gray-300"
                  locale={ptBR}
                />
              </div>
            </div>

            {showFilters && (
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg"
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                      <option value="">Todos</option>
                      <option value="ativo">Ativo</option>
                      <option value="inativo">Inativo</option>
                      <option value="vip">VIP</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Tipo</label>
                    <select
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg"
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                    >
                      <option value="">Todos</option>
                      <option value="pf">Pessoa Física</option>
                      <option value="pj">Pessoa Jurídica</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Data de Cadastro</label>
                    <DatePicker
                      selectsRange
                      startDate={startDate}
                      endDate={endDate}
                      onChange={(update) => {
                        setDateRange(update);
                        handleFilterChange('startDate', update[0]);
                        handleFilterChange('endDate', update[1]);
                      }}
                      isClearable
                      locale={ptBR}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg"
                      placeholderText="Selecione um período"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Lista de Clientes */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Última Compra</th>
                      <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Total em Compras</th>
                      <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {mockClients.map((client) => (
                      <tr key={client.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setSelectedClient(client)}
                            className="flex items-center group"
                          >
                            <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Users size={20} className="text-gray-500" />
                            </div>
                            <div className="ml-4 text-left">
                              <div className="text-sm font-medium text-blue-600 group-hover:text-blue-800 group-hover:underline">
                                {client.name}
                              </div>
                              <div className="text-sm text-gray-500">{client.email}</div>
                            </div>
                          </button>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {client.type === 'pf' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {client.lastPurchase ? new Date(client.lastPurchase).toLocaleDateString('pt-BR') : '-'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="text-sm text-gray-900">{client.totalPurchases} compras</div>
                          <div className="text-sm text-gray-500">
                            Média: {client.averageTicket.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${client.status === 'ativo' ? 'bg-green-100 text-green-800' : ''}
                            ${client.status === 'inativo' ? 'bg-gray-100 text-gray-800' : ''}
                            ${client.status === 'vip' ? 'bg-amber-100 text-amber-800' : ''}`}
                          >
                            {client.status === 'ativo' && 'Ativo'}
                            {client.status === 'inativo' && 'Inativo'}
                            {client.status === 'vip' && 'VIP'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Tabs.Content>

          <Tabs.Content value="reports" className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-base font-medium mb-4">Relatórios em Desenvolvimento</h3>
              <p className="text-gray-500">Esta seção está em construção.</p>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </main>

      {/* Modal de Detalhes do Cliente */}
      <Dialog.Root open={!!selectedClient} onOpenChange={(open) => !open && setSelectedClient(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-3xl max-h-[85vh] overflow-y-auto rounded-xl shadow-lg bg-white p-6">
            <div className="flex justify-between items-center mb-6">
              <Dialog.Title className="text-lg font-semibold">Detalhes do Cliente</Dialog.Title>
              <Dialog.Close className="p-1 rounded-full hover:bg-gray-100">
                <X size={20} className="text-gray-500" />
              </Dialog.Close>
            </div>

            {selectedClient && (
              <div className="space-y-6">
                {/* Informações Básicas */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Informações Básicas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Nome</h4>
                      <p className="text-sm">{selectedClient.name}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">E-mail</h4>
                      <p className="text-sm">{selectedClient.email}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Telefone</h4>
                      <p className="text-sm">{selectedClient.phone}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Documento</h4>
                      <p className="text-sm">{selectedClient.document}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Tipo</h4>
                      <p className="text-sm">{selectedClient.type === 'pf' ? 'Pessoa Física' : 'Pessoa Jurídica'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Data de Cadastro</h4>
                      <p className="text-sm">{new Date(selectedClient.createdAt).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Data de Atualização</h4>
                      <p className="text-sm">{new Date(selectedClient.updatedAt).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                </div>

                {/* Endereço */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Endereço</h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm">
                      {selectedClient.address.street}, {selectedClient.address.number}
                      {selectedClient.address.complement && ` - ${selectedClient.address.complement}`}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedClient.address.neighborhood} - {selectedClient.address.city}/{selectedClient.address.state}
                    </p>
                    <p className="text-sm text-gray-500">CEP: {selectedClient.address.zipCode}</p>
                  </div>
                </div>

                {/* Histórico de Compras */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Histórico de Compras</h3>
                  <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Total de Compras</h4>
                        <p className="text-sm">{selectedClient.totalPurchases} compras</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Ticket Médio</h4>
                        <p className="text-sm">
                          {selectedClient.averageTicket.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Transações Recentes</h4>
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-white border-b border-gray-200">
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Data</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Descrição</th>
                              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Valor</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {selectedClient.recentTransactions.map((transaction) => (
                              <tr key={transaction.id} className="hover:bg-white">
                                <td className="px-4 py-2 text-sm whitespace-nowrap">
                                  {new Date(transaction.date).toLocaleDateString('pt-BR')}
                                </td>
                                <td className="px-4 py-2 text-sm">{transaction.description}</td>
                                <td className="px-4 py-2 text-sm text-right">
                                  {transaction.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                    ${transaction.status === 'concluida' ? 'bg-green-100 text-green-800' : ''}
                                    ${transaction.status === 'andamento' ? 'bg-yellow-100 text-yellow-800' : ''}
                                    ${transaction.status === 'cancelada' ? 'bg-red-100 text-red-800' : ''}
                                  `}>
                                    {transaction.status === 'concluida' && 'Concluída'}
                                    {transaction.status === 'andamento' && 'Em Andamento'}
                                    {transaction.status === 'cancelada' && 'Cancelada'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default Clientes;
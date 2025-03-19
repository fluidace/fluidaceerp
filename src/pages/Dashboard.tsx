import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import {
  DollarSign, ShoppingCart, Package, Users,
  AlertTriangle, Bell, Home, Filter, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';

const salesData = [
  { name: 'Jan', receitas: 40000, despesas: 24000 },
  { name: 'Fev', receitas: 30000, despesas: 13980 },
  { name: 'Mar', receitas: 20000, despesas: 98000 },
  { name: 'Abr', receitas: 27800, despesas: 39080 },
  { name: 'Mai', receitas: 18900, despesas: 48000 },
  { name: 'Jun', receitas: 23900, despesas: 38000 },
];

const expenseDistribution = [
  { name: 'Operacional', value: 35 },
  { name: 'Marketing', value: 25 },
  { name: 'Pessoal', value: 30 },
  { name: 'Outros', value: 10 },
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

const recentTransactions = [
  { id: 1, description: 'Venda #1234', value: 'R$ 1.500,00', status: 'Recebido', date: '2024-03-20' },
  { id: 2, description: 'Fornecedor ABC', value: 'R$ 2.300,00', status: 'Pendente', date: '2024-03-19' },
  { id: 3, description: 'Venda #1235', value: 'R$ 750,00', status: 'Recebido', date: '2024-03-18' },
  { id: 4, description: 'Despesa Operacional', value: 'R$ 450,00', status: 'Pago', date: '2024-03-17' },
];

const recentActivities = [
  { id: 1, message: 'Novo pedido recebido #1236', time: '5 minutos atrás' },
  { id: 2, message: 'Estoque baixo: Produto XYZ', time: '30 minutos atrás' },
  { id: 3, message: 'Pagamento confirmado #1234', time: '1 hora atrás' },
  { id: 4, message: 'Novo cliente cadastrado', time: '2 horas atrás' },
];

const lowStockProducts = [
  { id: 1, name: 'Produto A', current: 5, min: 10 },
  { id: 2, name: 'Produto B', current: 3, min: 15 },
  { id: 3, name: 'Produto C', current: 8, min: 20 },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-400">
      {/* Header Fixo */}
      <header className="sticky top-0 z-10 backdrop-blur-sm bg-opacity-90">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-blue-100 rounded-xl">
                <Home size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-sm text-gray-500">Visão geral do seu negócio</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Filter size={20} />
              </button>
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
              value="activities"
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'activities'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Atividades
            </Tabs.Trigger>
          </Tabs.List>

          {/* Conteúdo das Tabs */}
          <Tabs.Content value="overview" className="space-y-6">
            {/* Cards de Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Saldo em Caixa</span>
                  <span className="p-2 bg-blue-100 rounded-lg">
                    <DollarSign size={20} className="text-blue-600" />
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-2xl font-bold">R$ 125.400</span>
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <ArrowUpRight size={16} className="text-green-500" />
                  <span className="text-green-500 font-medium">12.5%</span>
                  <span className="text-gray-500 ml-2">vs. mês anterior</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Vendas do Mês</span>
                  <span className="p-2 bg-green-100 rounded-lg">
                    <ShoppingCart size={20} className="text-green-600" />
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-2xl font-bold">R$ 84.300</span>
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <ArrowDownRight size={16} className="text-red-500" />
                  <span className="text-red-500 font-medium">3.2%</span>
                  <span className="text-gray-500 ml-2">vs. mês anterior</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Produtos em Estoque</span>
                  <span className="p-2 bg-amber-100 rounded-lg">
                    <Package size={20} className="text-amber-600" />
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-2xl font-bold">1.234</span>
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <AlertTriangle size={16} className="text-amber-500" />
                  <span className="text-amber-500 font-medium">5 alertas</span>
                  <span className="text-gray-500 ml-2">de estoque baixo</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Clientes Ativos</span>
                  <span className="p-2 bg-blue-100 rounded-lg">
                    <Users size={20} className="text-blue-600" />
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-2xl font-bold">892</span>
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <ArrowUpRight size={16} className="text-green-500" />
                  <span className="text-green-500 font-medium">8.1%</span>
                  <span className="text-gray-500 ml-2">vs. mês anterior</span>
                </div>
              </div>
            </div>

            {/* Gráficos e Tabelas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Receitas vs Despesas</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="receitas" fill="#10B981" />
                      <Bar dataKey="despesas" fill="#EF4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Distribuição de Despesas</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {expenseDistribution.map((_, index) => (
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

            {/* Últimas Transações e Produtos com Estoque Baixo */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold">Últimas Transações</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                        <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentTransactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">{transaction.description}</td>
                          <td className="px-6 py-4 text-right text-sm text-gray-900">{transaction.value}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                transaction.status === 'Recebido'
                                  ? 'bg-green-100 text-green-800'
                                  : transaction.status === 'Pendente'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {transaction.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">{transaction.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold">Produtos com Estoque Baixo</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                        <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Atual</th>
                        <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Mínimo</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {lowStockProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">{product.name}</td>
                          <td className="px-6 py-4 text-right text-sm text-gray-900">{product.current}</td>
                          <td className="px-6 py-4 text-right text-sm text-gray-900">{product.min}</td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              Estoque Baixo
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Tabs.Content>

          <Tabs.Content value="activities" className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Atividades Recentes</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Bell size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </main>
    </div>
  );
};

export default Dashboard;
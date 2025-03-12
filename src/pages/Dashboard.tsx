import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, Users,
  AlertTriangle, Bell, Download, Calendar, Filter
} from 'lucide-react';

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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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
  return (
    <div className="bg-gray-50 text-gray-900">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
              <Download size={20} /> Exportar
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
              <Filter size={20} /> Filtros
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Saldo em Caixa</p>
                <h3 className="text-2xl font-bold">R$ 125.400</h3>
                <p className="text-sm text-green-500 flex items-center mt-2">
                  <TrendingUp size={16} className="mr-1" /> +12.5%
                </p>
              </div>
              <DollarSign size={40} className="text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Vendas do Mês</p>
                <h3 className="text-2xl font-bold">R$ 84.300</h3>
                <p className="text-sm text-red-500 flex items-center mt-2">
                  <TrendingDown size={16} className="mr-1" /> -3.2%
                </p>
              </div>
              <ShoppingCart size={40} className="text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Produtos em Estoque</p>
                <h3 className="text-2xl font-bold">1.234</h3>
                <p className="text-sm text-yellow-500 flex items-center mt-2">
                  <AlertTriangle size={16} className="mr-1" /> 5 alertas
                </p>
              </div>
              <Package size={40} className="text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Clientes Ativos</p>
                <h3 className="text-2xl font-bold">892</h3>
                <p className="text-sm text-green-500 flex items-center mt-2">
                  <TrendingUp size={16} className="mr-1" /> +8.1%
                </p>
              </div>
              <Users size={40} className="text-blue-500" />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Receitas vs Despesas</h3>
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

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Distribuição de Despesas</h3>
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
                    {expenseDistribution.map((entry, index) => (
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

        {/* Recent Transactions and Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Últimas Transações</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Descrição</th>
                    <th className="text-left py-2">Valor</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-left py-2">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b">
                      <td className="py-2">{transaction.description}</td>
                      <td className="py-2">{transaction.value}</td>
                      <td className="py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            transaction.status === 'Recebido'
                              ? 'bg-green-100 text-green-800'
                              : transaction.status === 'Pendente'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                      <td className="py-2">{transaction.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Atividades Recentes</h3>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4">
                  <div className="rounded-full bg-blue-100 p-2">
                    <Bell size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Alertas de Estoque Baixo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockProducts.map((product) => (
              <div
                key={product.id}
                className="border border-red-200 rounded-lg p-4 bg-red-50"
              >
                <h4 className="font-semibold text-red-700">{product.name}</h4>
                <p className="text-sm text-red-600">
                  Estoque atual: {product.current} (Mínimo: {product.min})
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
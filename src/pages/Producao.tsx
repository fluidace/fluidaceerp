import { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { ptBR } from 'date-fns/locale';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import {
  Bot, FileCheck, AlertOctagon, MessageSquare, 
  Camera, QrCode, ClipboardCheck, TestTube, 
  Wifi, FileSpreadsheet, BarChart2, Plus,
  ArrowUpRight, ArrowDownRight, Archive, Calculator,
  Timer, Building2, Factory, Package, Boxes, Scale,
  Calendar, Truck, ShieldCheck, RefreshCw, Search,
  Filter, X, TrendingUp
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const productionByCategory = [
  { name: 'Categoria A', value: 40 },
  { name: 'Categoria B', value: 30 },
  { name: 'Categoria C', value: 20 },
  { name: 'Categoria D', value: 10 },
];

const monthlyProduction = [
  { name: 'Jan', producao: 950, meta: 1000 },
  { name: 'Fev', producao: 980, meta: 1000 },
  { name: 'Mar', producao: 920, meta: 1000 },
  { name: 'Abr', producao: 960, meta: 1000 },
  { name: 'Mai', producao: 990, meta: 1000 },
  { name: 'Jun', producao: 970, meta: 1000 },
];

// Dados para gráficos de qualidade
const qualityMetrics = [
  { name: 'Jan', aprovados: 95, rejeitados: 5 },
  { name: 'Fev', aprovados: 93, rejeitados: 7 },
  { name: 'Mar', aprovados: 97, rejeitados: 3 },
  { name: 'Abr', aprovados: 94, rejeitados: 6 },
  { name: 'Mai', aprovados: 96, rejeitados: 4 },
  { name: 'Jun', aprovados: 98, rejeitados: 2 },
];

const defectTypes = [
  { name: 'Matéria-prima', value: 35 },
  { name: 'Processo', value: 25 },
  { name: 'Humano', value: 20 },
  { name: 'Equipamento', value: 20 },
];

const Producao = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-400">
      {/* Header Fixo */}
      <header className="sticky top-0 z-10 backdrop-blur-sm bg-opacity-90">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-blue-100 rounded-xl">
                <Factory size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Produção</h1>
                <p className="text-sm text-gray-500">Gestão e controle da produção</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Dialog.Root>
                <Dialog.Trigger asChild>
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    <Plus size={20} />
                    <span className="font-medium">Nova Ordem de Produção</span>
                  </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                  <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-3xl max-h-[85vh] overflow-y-auto rounded-xl shadow-lg bg-white p-6">
                    <div className="flex justify-between items-center mb-6">
                      <Dialog.Title className="text-lg font-semibold">Nova Ordem de Produção</Dialog.Title>
                      <Dialog.Close className="p-1 rounded-full hover:bg-gray-100">
                        <X size={20} className="text-gray-500" />
                      </Dialog.Close>
                    </div>
                    
                    <form className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Produto</label>
                          <select
                            name="product"
                            required
                            className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300"
                          >
                            <option value="">Selecione o produto...</option>
                            <option value="1">Produto A</option>
                            <option value="2">Produto B</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Quantidade</label>
                          <input
                            type="number"
                            name="quantity"
                            required
                            min="1"
                            className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300"
                            placeholder="Quantidade"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Prioridade</label>
                          <select
                            name="priority"
                            required
                            className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300"
                          >
                            <option value="baixa">Baixa</option>
                            <option value="normal">Normal</option>
                            <option value="alta">Alta</option>
                            <option value="urgente">Urgente</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Prazo</label>
                          <DatePicker
                            selected={new Date()}
                            onChange={() => {}}
                            className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300"
                            dateFormat="dd/MM/yyyy"
                            locale={ptBR}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Descrição</label>
                        <textarea
                          name="description"
                          rows={3}
                          className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300"
                          placeholder="Descrição da ordem de produção"
                        />
                      </div>

                      <div className="flex justify-end gap-3">
                        <Dialog.Close className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                          Cancelar
                        </Dialog.Close>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Criar Ordem
                        </button>
                      </div>
                    </form>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-8 pb-32">
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
              value="orders"
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'orders'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Ordens de Produção
            </Tabs.Trigger>
            <Tabs.Trigger
              value="raw-materials"
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'raw-materials'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Matéria-Prima
            </Tabs.Trigger>
            <Tabs.Trigger
              value="quality"
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'quality'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Controle de Qualidade
            </Tabs.Trigger>
          </Tabs.List>

          {/* Conteúdo das Tabs */}
          <Tabs.Content value="overview" className="space-y-6">
            {/* Cards de Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Produção do Mês</span>
                  <span className="p-2 bg-blue-100 rounded-lg">
                    <Factory size={20} className="text-blue-600" />
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-2xl font-bold">1,234</span>
                  <span className="text-sm text-gray-500 ml-2">unidades</span>
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <ArrowUpRight size={16} className="text-green-500" />
                  <span className="text-green-500 font-medium">12%</span>
                  <span className="text-gray-500 ml-2">vs. mês anterior</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Produtividade</span>
                  <span className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp size={20} className="text-green-600" />
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-2xl font-bold">95%</span>
                  <span className="text-sm text-gray-500 ml-2">eficiência</span>
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <ArrowUpRight size={16} className="text-green-500" />
                  <span className="text-green-500 font-medium">3%</span>
                  <span className="text-gray-500 ml-2">vs. mês anterior</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Desperdício</span>
                  <span className="p-2 bg-amber-100 rounded-lg">
                    <AlertOctagon size={20} className="text-amber-600" />
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-2xl font-bold">3.2%</span>
                  <span className="text-sm text-gray-500 ml-2">média</span>
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <ArrowDownRight size={16} className="text-red-500" />
                  <span className="text-red-500 font-medium">0.5%</span>
                  <span className="text-gray-500 ml-2">vs. meta</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Tempo Médio</span>
                  <span className="p-2 bg-purple-100 rounded-lg">
                    <Timer size={20} className="text-purple-600" />
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-2xl font-bold">45min</span>
                  <span className="text-sm text-gray-500 ml-2">por unidade</span>
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <ArrowUpRight size={16} className="text-green-500" />
                  <span className="text-green-500 font-medium">10%</span>
                  <span className="text-gray-500 ml-2">mais rápido</span>
                </div>
              </div>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Evolução da Produção</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyProduction}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="name" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip 
                        formatter={(value: number) => `${value} unidades`}
                        labelStyle={{ color: '#111827' }}
                        contentStyle={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.5rem' }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="producao" 
                        name="Produção" 
                        stroke="#10B981" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="meta" 
                        name="Meta" 
                        stroke="#3B82F6" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-base font-medium mb-4">Distribuição por Categoria</h3>
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={productionByCategory}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#10B981"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {productionByCategory.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value} unidades`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Gráficos e Análises */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 bg-white rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Controle Estatístico de Processo</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={qualityMetrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="name" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip 
                      formatter={(value: number) => `${value}%`}
                      labelStyle={{ color: '#111827' }}
                      contentStyle={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.5rem' }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="aprovados" 
                      name="Aprovados" 
                      fill="#10B981"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="rejeitados" 
                      name="Rejeitados" 
                      fill="#EF4444"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="p-6 bg-white rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Tipos de Defeitos</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={defectTypes}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#10B981"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {defectTypes.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Tabs.Content>

          <Tabs.Content value="orders" className="space-y-6">
            {/* Filtros e Busca */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar ordens..."
                    className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  onChange={(update) => setDateRange(update)}
                  placeholderText="Selecione o período"
                  className="px-3 py-2 rounded-lg border border-gray-300"
                  locale={ptBR}
                />
              </div>
            </div>

            {/* Lista de Ordens */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Ordem</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                      <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
                      <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Prazo</th>
                      <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Progresso</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">#OP-2025001</td>
                      <td className="px-6 py-4 text-sm">Produto A</td>
                      <td className="px-6 py-4 text-right text-sm text-gray-500">100</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Em Andamento
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">15/03/2025</td>
                      <td className="px-6 py-4 text-right text-sm text-gray-500">75%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Tabs.Content>

          <Tabs.Content value="raw-materials" className="h-[calc(100vh-12rem)] overflow-y-auto space-y-6 pr-6 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
            {/* Filtros */}
            <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
              <div className="flex-1 flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Buscar insumos..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex-1 relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Filtrar por data..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <button className="px-4 py-2 flex items-center gap-2 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100">
                <Filter size={20} />
                <span>Filtros</span>
              </button>
              <button className="px-4 py-2 flex items-center gap-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                <Plus size={20} />
                <span>Novo Insumo</span>
              </button>
            </div>

            <Tabs.Root defaultValue="overview" className="space-y-6">
              <Tabs.List className="flex gap-1 p-1 w-fit bg-gray-100 rounded-lg">
                <Tabs.Trigger
                  value="overview"
                  className="px-4 py-2 rounded-md transition-colors data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600 hover:text-gray-900"
                >
                  Visão Geral
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="inventory"
                  className="px-4 py-2 rounded-md transition-colors data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600 hover:text-gray-900"
                >
                  Estoque e Depósitos
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="planning"
                  className="px-4 py-2 rounded-md transition-colors data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600 hover:text-gray-900"
                >
                  Planejamento
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="reports"
                  className="px-4 py-2 rounded-md transition-colors data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600 hover:text-gray-900"
                >
                  Relatórios
                </Tabs.Trigger>
              </Tabs.List>

              {/* Aba: Visão Geral */}
              <Tabs.Content value="overview" className="space-y-6">
                {/* Métricas Principais */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="p-6 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-blue-100 rounded-xl">
                        <Archive size={24} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total de Insumos</p>
                        <p className="text-2xl font-semibold">1.245</p>
                        <p className="text-sm text-green-600 flex items-center gap-1">
                          <ArrowUpRight size={16} />
                          <span>+12 este mês</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-green-100 rounded-xl">
                        <Calculator size={24} className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Valor em Estoque</p>
                        <p className="text-2xl font-semibold">R$ 850K</p>
                        <p className="text-sm text-green-600 flex items-center gap-1">
                          <ArrowUpRight size={16} />
                          <span>+5.2% vs mês anterior</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-amber-100 rounded-xl">
                        <Timer size={24} className="text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Itens Próx. Vencimento</p>
                        <p className="text-2xl font-semibold">23</p>
                        <p className="text-sm text-amber-600 flex items-center gap-1">
                          <AlertOctagon size={16} />
                          <span>Ação necessária</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-purple-100 rounded-xl">
                        <Building2 size={24} className="text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Fornecedores Ativos</p>
                        <p className="text-2xl font-semibold">48</p>
                        <p className="text-sm text-green-600 flex items-center gap-1">
                          <ArrowUpRight size={16} />
                          <span>+3 este mês</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Classificação de Insumos */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="p-6 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-base font-medium">Classificação de Insumos</h3>
                      <button className="text-blue-600 hover:text-blue-700">Ver todos</button>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Boxes className="text-blue-600" size={20} />
                          <div>
                            <p className="font-medium">Matéria-Prima</p>
                            <p className="text-sm text-gray-500">487 itens</p>
                          </div>
                        </div>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                          39%
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Package className="text-green-600" size={20} />
                          <div>
                            <p className="font-medium">Embalagens</p>
                            <p className="text-sm text-gray-500">312 itens</p>
                          </div>
                        </div>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                          25%
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Scale className="text-purple-600" size={20} />
                          <div>
                            <p className="font-medium">Componentes</p>
                            <p className="text-sm text-gray-500">446 itens</p>
                          </div>
                        </div>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
                          36%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-base font-medium">Próximos Vencimentos</h3>
                      <button className="text-blue-600 hover:text-blue-700">Ver todos</button>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Calendar className="text-red-600" size={20} />
                          <div>
                            <p className="font-medium">Insumo A</p>
                            <p className="text-sm text-gray-500">Vence em 5 dias</p>
                          </div>
                        </div>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                          Urgente
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Calendar className="text-amber-600" size={20} />
                          <div>
                            <p className="font-medium">Insumo B</p>
                            <p className="text-sm text-gray-500">Vence em 15 dias</p>
                          </div>
                        </div>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700">
                          Atenção
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Calendar className="text-amber-600" size={20} />
                          <div>
                            <p className="font-medium">Insumo C</p>
                            <p className="text-sm text-gray-500">Vence em 20 dias</p>
                          </div>
                        </div>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700">
                          Atenção
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Tabs.Content>

              {/* Aba: Estoque e Depósitos */}
              <Tabs.Content value="inventory" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="p-6 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <Factory className="text-blue-600" size={24} />
                      <h3 className="text-lg font-semibold">Depósito Principal</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Ocupação</span>
                        <span className="font-medium">75%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                      <p className="text-sm text-gray-500">487 itens em estoque</p>
                    </div>
                    <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Gerenciar
                    </button>
                  </div>

                  <div className="p-6 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <Factory className="text-green-600" size={24} />
                      <h3 className="text-lg font-semibold">Depósito Secundário</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Ocupação</span>
                        <span className="font-medium">45%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                      <p className="text-sm text-gray-500">312 itens em estoque</p>
                    </div>
                    <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Gerenciar
                    </button>
                  </div>

                  <div className="p-6 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <Factory className="text-purple-600" size={24} />
                      <h3 className="text-lg font-semibold">Depósito de Embalagens</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Ocupação</span>
                        <span className="font-medium">60%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                      <p className="text-sm text-gray-500">446 itens em estoque</p>
                    </div>
                    <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Gerenciar
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-base font-medium">Movimentações Recentes</h3>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                      <Plus size={20} />
                      <span>Nova Movimentação</span>
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">ID</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Insumo</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Tipo</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Quantidade</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Data</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Responsável</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm">#MOV001</td>
                          <td className="px-6 py-4 text-sm">Insumo A</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                              Entrada
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">500 kg</td>
                          <td className="px-6 py-4 text-sm">15/03/2025</td>
                          <td className="px-6 py-4 text-sm">João Silva</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm">#MOV002</td>
                          <td className="px-6 py-4 text-sm">Insumo B</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                              Saída
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">200 un</td>
                          <td className="px-6 py-4 text-sm">15/03/2025</td>
                          <td className="px-6 py-4 text-sm">Maria Santos</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </Tabs.Content>

              {/* Aba: Planejamento */}
              <Tabs.Content value="planning" className="space-y-6">
                {/* MRP e Necessidades */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="p-6 bg-white rounded-xl shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Calculator className="text-blue-600" size={24} />
                        <h3 className="text-lg font-semibold">MRP</h3>
                      </div>
                      <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                        <Plus size={16} />
                        <span>Novo Cálculo</span>
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium mb-2">Próximas Necessidades</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Alumínio 6063</span>
                            <span className="font-medium">2.500 kg</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Vidro Temperado</span>
                            <span className="font-medium">150 m²</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Borracha EPDM</span>
                            <span className="font-medium">800 m</span>
                          </div>
                        </div>
                      </div>
                      <button className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                        Ver Todas Necessidades
                      </button>
                    </div>
                  </div>

                  <div className="p-6 bg-white rounded-xl shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Truck className="text-blue-600" size={24} />
                        <h3 className="text-lg font-semibold">Fornecedores</h3>
                      </div>
                      <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                        <Plus size={16} />
                        <span>Novo Fornecedor</span>
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium mb-2">Principais Fornecedores</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Alumínios SA</span>
                            <span className="text-green-600 text-sm">98% Pontualidade</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Vidros Tech</span>
                            <span className="text-green-600 text-sm">95% Pontualidade</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Borrachas BR</span>
                            <span className="text-amber-600 text-sm">85% Pontualidade</span>
                          </div>
                        </div>
                      </div>
                      <button className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                        Ver Todos Fornecedores
                      </button>
                    </div>
                  </div>
                </div>

                {/* Reposição e Certificações */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="p-6 bg-white rounded-xl shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <RefreshCw className="text-blue-600" size={24} />
                        <h3 className="text-lg font-semibold">Reposição Automática</h3>
                      </div>
                      <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                        <Plus size={16} />
                        <span>Nova Regra</span>
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium mb-2">Regras Ativas</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Alumínio 6063</span>
                            <span className="text-sm">Min: 1.000 kg</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Vidro Temperado</span>
                            <span className="text-sm">Min: 50 m²</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Borracha EPDM</span>
                            <span className="text-sm">Min: 200 m</span>
                          </div>
                        </div>
                      </div>
                      <button className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                        Ver Todas Regras
                      </button>
                    </div>
                  </div>

                  <div className="p-6 bg-white rounded-xl shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="text-blue-600" size={24} />
                        <h3 className="text-lg font-semibold">Certificações</h3>
                      </div>
                      <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                        <Plus size={16} />
                        <span>Nova Certificação</span>
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium mb-2">Status das Certificações</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">ISO 9001</span>
                            <span className="text-green-600 text-sm">Válido até 12/2025</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">ISO 14001</span>
                            <span className="text-amber-600 text-sm">Renovação em 3 meses</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">OHSAS 18001</span>
                            <span className="text-green-600 text-sm">Válido até 08/2025</span>
                          </div>
                        </div>
                      </div>
                      <button className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                        Ver Todas Certificações
                      </button>
                    </div>
                  </div>
                </div>
              </Tabs.Content>

              {/* Aba: Relatórios */}
              <Tabs.Content value="reports" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="p-6 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <FileSpreadsheet className="text-blue-600" size={24} />
                      <h3 className="text-lg font-semibold">Relatório de Consumo</h3>
                    </div>
                    <p className="text-gray-600 mb-4">Análise detalhada do consumo de matéria-prima.</p>
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Gerar Relatório
                    </button>
                  </div>

                  <div className="p-6 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <BarChart2 className="text-blue-600" size={24} />
                      <h3 className="text-lg font-semibold">Análise de Tendências</h3>
                    </div>
                    <p className="text-gray-600 mb-4">Visualização de tendências e padrões de consumo ao longo do tempo.</p>
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Ver Análise
                    </button>
                  </div>

                  <div className="p-6 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <AlertOctagon className="text-blue-600" size={24} />
                      <h3 className="text-lg font-semibold">Relatório de Não Conformidades</h3>
                    </div>
                    <p className="text-gray-600 mb-4">Análise detalhada das não conformidades e ações corretivas.</p>
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Gerar Relatório
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="p-6 bg-white rounded-xl shadow-sm">
                    <h3 className="text-base font-medium mb-4">Consumo Mensal de Insumos</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={qualityMetrics}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="name" stroke="#6B7280" />
                        <YAxis stroke="#6B7280" />
                        <Tooltip 
                          formatter={(value: number) => `${value} kg`}
                          labelStyle={{ color: '#111827' }}
                          contentStyle={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.5rem' }}
                        />
                        <Legend />
                        <Bar 
                          dataKey="consumo" 
                          name="Consumo" 
                          fill="#3B82F6"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="p-6 bg-white rounded-xl shadow-sm">
                    <h3 className="text-base font-medium mb-4">Custos por Categoria</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={defectTypes}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#3B82F6"
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        >
                          {defectTypes.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `R$ ${value}`} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </Tabs.Content>
            </Tabs.Root>
          </Tabs.Content>

          <Tabs.Content value="quality" className="h-[calc(100vh-12rem)] overflow-y-auto space-y-6 pr-6 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
            {/* Sub-tabs para Controle de Qualidade */}
            <Tabs.Root defaultValue="overview" className="space-y-6">
              <Tabs.List className="flex gap-1 p-1 w-fit bg-gray-100 rounded-lg">
                <Tabs.Trigger
                  value="overview"
                  className="px-4 py-2 rounded-md transition-colors data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600 hover:text-gray-900"
                >
                  Visão Geral
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="inspection"
                  className="px-4 py-2 rounded-md transition-colors data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600 hover:text-gray-900"
                >
                  Inspeção
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="nonconformities"
                  className="px-4 py-2 rounded-md transition-colors data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600 hover:text-gray-900"
                >
                  Não Conformidades
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="reports"
                  className="px-4 py-2 rounded-md transition-colors data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600 hover:text-gray-900"
                >
                  Relatórios
                </Tabs.Trigger>
              </Tabs.List>

              {/* Aba: Visão Geral */}
              <Tabs.Content value="overview" className="space-y-6">
                {/* Métricas Principais */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="p-6 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-blue-100 rounded-xl">
                        <Bot size={24} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Inspeções Automatizadas</p>
                        <p className="text-2xl font-bold">98.5%</p>
                        <p className="text-sm text-green-600 flex items-center gap-1">
                          <ArrowUpRight size={16} />
                          <span>+2.3% vs mês anterior</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-green-100 rounded-xl">
                        <FileCheck size={24} className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Taxa de Aprovação</p>
                        <p className="text-2xl font-bold">95.8%</p>
                        <p className="text-sm text-green-600 flex items-center gap-1">
                          <ArrowUpRight size={16} />
                          <span>+1.2% vs meta</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-amber-100 rounded-xl">
                        <AlertOctagon size={24} className="text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Não Conformidades</p>
                        <p className="text-2xl font-bold">4.2%</p>
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <ArrowDownRight size={16} />
                          <span>-0.8% vs meta</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-purple-100 rounded-xl">
                        <MessageSquare size={24} className="text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Reclamações</p>
                        <p className="text-2xl font-bold">0.5%</p>
                        <p className="text-sm text-green-600 flex items-center gap-1">
                          <ArrowUpRight size={16} />
                          <span>-0.3% vs mês anterior</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gráficos de Análise */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="p-6 bg-white rounded-xl shadow-sm">
                    <h3 className="text-base font-medium mb-4">Controle Estatístico de Processo</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={qualityMetrics}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="name" stroke="#6B7280" />
                        <YAxis stroke="#6B7280" />
                        <Tooltip 
                          formatter={(value: number) => `${value}%`}
                          labelStyle={{ color: '#111827' }}
                          contentStyle={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.5rem' }}
                        />
                        <Legend />
                        <Bar 
                          dataKey="aprovados" 
                          name="Aprovados" 
                          fill="#10B981"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar 
                          dataKey="rejeitados" 
                          name="Rejeitados" 
                          fill="#EF4444"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="p-6 bg-white rounded-xl shadow-sm">
                    <h3 className="text-base font-medium mb-4">Tipos de Defeitos</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={defectTypes}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#10B981"
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        >
                          {defectTypes.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </Tabs.Content>

              {/* Aba: Inspeção */}
              <Tabs.Content value="inspection" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="p-6 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <Camera className="text-blue-600" size={24} />
                      <h3 className="text-lg font-semibold">Inspeção por IA</h3>
                    </div>
                    <p className="text-gray-600 mb-4">Sistema de visão computacional para detecção automática de defeitos.</p>
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Iniciar Inspeção
                    </button>
                  </div>

                  <div className="p-6 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <QrCode className="text-blue-600" size={24} />
                      <h3 className="text-lg font-semibold">Rastreabilidade</h3>
                    </div>
                    <p className="text-gray-600 mb-4">Rastreamento completo do produto com QR Code e histórico.</p>
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Gerar QR Code
                    </button>
                  </div>

                  <div className="p-6 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <ClipboardCheck className="text-blue-600" size={24} />
                      <h3 className="text-lg font-semibold">Checklist Digital</h3>
                    </div>
                    <p className="text-gray-600 mb-4">Lista de verificação personalizada para inspeção de qualidade.</p>
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Novo Checklist
                    </button>
                  </div>

                  <div className="p-6 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <TestTube className="text-blue-600" size={24} />
                      <h3 className="text-lg font-semibold">Amostragem</h3>
                    </div>
                    <p className="text-gray-600 mb-4">Sistema inteligente de amostragem baseado em histórico.</p>
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Definir Amostra
                    </button>
                  </div>

                  <div className="p-6 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <Wifi className="text-blue-600" size={24} />
                      <h3 className="text-lg font-semibold">IoT & Sensores</h3>
                    </div>
                    <p className="text-gray-600 mb-4">Monitoramento em tempo real de variáveis do processo.</p>
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Ver Sensores
                    </button>
                  </div>
                </div>
              </Tabs.Content>

              {/* Aba: Não Conformidades */}
              <Tabs.Content value="nonconformities" className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-base font-medium">Registros de Não Conformidades</h3>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                      <Plus size={20} />
                      <span>Nova Não Conformidade</span>
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">ID</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Produto</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Tipo</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Data</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm">#NC001</td>
                          <td className="px-6 py-4 text-sm">Produto A</td>
                          <td className="px-6 py-4 text-sm">Matéria-prima</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700">
                              Em análise
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">15/03/2025</td>
                          <td className="px-6 py-4">
                            <button className="text-blue-600 hover:text-blue-700">Detalhes</button>
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm">#NC002</td>
                          <td className="px-6 py-4 text-sm">Produto B</td>
                          <td className="px-6 py-4 text-sm">Processo</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                              Resolvido
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">14/03/2025</td>
                          <td className="px-6 py-4">
                            <button className="text-blue-600 hover:text-blue-700">Detalhes</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </Tabs.Content>

              {/* Aba: Relatórios */}
              <Tabs.Content value="reports" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="p-6 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <FileSpreadsheet className="text-blue-600" size={24} />
                      <h3 className="text-lg font-semibold">Relatório de Qualidade</h3>
                    </div>
                    <p className="text-gray-600 mb-4">Análise detalhada dos indicadores de qualidade e tendências.</p>
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Gerar Relatório
                    </button>
                  </div>

                  <div className="p-6 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <BarChart2 className="text-blue-600" size={24} />
                      <h3 className="text-lg font-semibold">Análise de Tendências</h3>
                    </div>
                    <p className="text-gray-600 mb-4">Visualização de tendências e padrões de qualidade ao longo do tempo.</p>
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Ver Análise
                    </button>
                  </div>

                  <div className="p-6 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <AlertOctagon className="text-blue-600" size={24} />
                      <h3 className="text-lg font-semibold">Relatório de Não Conformidades</h3>
                    </div>
                    <p className="text-gray-600 mb-4">Análise detalhada das não conformidades e ações corretivas.</p>
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Gerar Relatório
                    </button>
                  </div>
                </div>
              </Tabs.Content>
            </Tabs.Root>
          </Tabs.Content>
        </Tabs.Root>
      </main>
    </div>
  );
};

export default Producao;

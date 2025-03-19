import { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { ptBR } from 'date-fns/locale';
import {
  FileText, Search, Filter, Plus, X,
  ArrowUpRight, ArrowDownRight,
  DollarSign, FileBarChart, FileCheck,
  Download, Printer, Send
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

const nfeData = [
  { month: 'Jan', emitidas: 45, canceladas: 2 },
  { month: 'Fev', emitidas: 52, canceladas: 1 },
  { month: 'Mar', emitidas: 48, canceladas: 3 },
  { month: 'Abr', emitidas: 63, canceladas: 2 },
  { month: 'Mai', emitidas: 58, canceladas: 1 },
  { month: 'Jun', emitidas: 72, canceladas: 4 },
];

const nfeByStatus = [
  { name: 'Aprovadas', value: 65 },
  { name: 'Pendentes', value: 25 },
  { name: 'Canceladas', value: 10 },
];

const NotasFiscais = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
      <header className="sticky top-0 z-10 backdrop-blur-sm bg-opacity-90">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-blue-100 rounded-xl">
                <FileText size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Notas Fiscais</h1>
                <p className="text-sm text-gray-500">Gestão e emissão de notas fiscais</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar nota fiscal..."
                  className="w-64 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 flex items-center gap-2 border ${
                  showFilters ? 'border-blue-500 text-blue-500' : 'border-gray-200 text-gray-700'
                } rounded-lg hover:bg-gray-50`}
              >
                <Filter size={20} />
                <span>Filtros</span>
              </button>

              <Dialog.Root>
                <Dialog.Trigger asChild>
                  <button className="px-4 py-2 flex items-center gap-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                    <Plus size={20} />
                    <span>Nova Nota</span>
                  </button>
                </Dialog.Trigger>
              </Dialog.Root>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Filtros</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Período</label>
                  <DatePicker
                    selectsRange={true}
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(update) => setDateRange(update)}
                    locale={ptBR}
                    dateFormat="dd/MM/yyyy"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholderText="Selecione um período"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Todos</option>
                    <option value="aprovada">Aprovada</option>
                    <option value="pendente">Pendente</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tipo</label>
                  <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Todos</option>
                    <option value="entrada">Entrada</option>
                    <option value="saida">Saída</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-8 pb-32">
        <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
          <Tabs.List className="flex gap-1 p-1 mb-6 w-fit bg-gray-100 rounded-lg">
            <Tabs.Trigger
              value="overview"
              className="px-4 py-2 text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
            >
              Visão Geral
            </Tabs.Trigger>
            <Tabs.Trigger
              value="emitidas"
              className="px-4 py-2 text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
            >
              Emitidas
            </Tabs.Trigger>
            <Tabs.Trigger
              value="recebidas"
              className="px-4 py-2 text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
            >
              Recebidas
            </Tabs.Trigger>
            <Tabs.Trigger
              value="relatorios"
              className="px-4 py-2 text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
            >
              Relatórios
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <FileCheck className="text-blue-600" size={24} />
                    <h3 className="text-lg font-medium">Total Emitidas</h3>
                  </div>
                  <span className="flex items-center gap-1 text-green-600">
                    <ArrowUpRight size={20} />
                    12%
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">338</span>
                  <span className="text-gray-500">notas</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <FileBarChart className="text-blue-600" size={24} />
                    <h3 className="text-lg font-medium">Total Canceladas</h3>
                  </div>
                  <span className="flex items-center gap-1 text-red-600">
                    <ArrowDownRight size={20} />
                    3%
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">13</span>
                  <span className="text-gray-500">notas</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <DollarSign className="text-blue-600" size={24} />
                    <h3 className="text-lg font-medium">Valor Total</h3>
                  </div>
                  <span className="flex items-center gap-1 text-green-600">
                    <ArrowUpRight size={20} />
                    8%
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">R$ 127.439,50</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-medium mb-6">Evolução de Notas Fiscais</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={nfeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="emitidas" fill="#3B82F6" name="Emitidas" />
                      <Bar dataKey="canceladas" fill="#EF4444" name="Canceladas" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-medium mb-6">Status das Notas</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={nfeByStatus}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {nfeByStatus.map((_, index) => (
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

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium">Últimas Notas Emitidas</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Número</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Cliente</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Data</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Valor</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">NF-e 12345</td>
                      <td className="px-6 py-4 text-sm">Empresa ABC Ltda</td>
                      <td className="px-6 py-4 text-sm">15/03/2025</td>
                      <td className="px-6 py-4 text-sm">R$ 4.500,00</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                          Aprovada
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <Download size={18} />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <Printer size={18} />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <Send size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Tabs.Content>

          <Tabs.Content value="emitidas" className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Notas Fiscais Emitidas</h3>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>Exibindo</span>
                      <select className="px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg">
                        <option>10</option>
                        <option>25</option>
                        <option>50</option>
                      </select>
                      <span>por página</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Número</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Cliente</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Data</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Valor</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[1, 2, 3].map((_, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm">NF-e {12345 + index}</td>
                        <td className="px-6 py-4 text-sm">Empresa {['ABC', 'XYZ', 'DEF'][index]} Ltda</td>
                        <td className="px-6 py-4 text-sm">15/03/2025</td>
                        <td className="px-6 py-4 text-sm">R$ {(4500 + index * 1000).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            index === 0 ? 'bg-green-100 text-green-700' :
                            index === 1 ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {index === 0 ? 'Aprovada' : index === 1 ? 'Pendente' : 'Cancelada'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                              <Download size={18} />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                              <Printer size={18} />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                              <Send size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Mostrando 1-3 de 120 notas</span>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1 text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100">
                      Anterior
                    </button>
                    <button className="px-3 py-1 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                      1
                    </button>
                    <button className="px-3 py-1 text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100">
                      2
                    </button>
                    <button className="px-3 py-1 text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100">
                      3
                    </button>
                    <button className="px-3 py-1 text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100">
                      Próxima
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Tabs.Content>

          <Tabs.Content value="recebidas" className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Notas Fiscais Recebidas</h3>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>Exibindo</span>
                      <select className="px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg">
                        <option>10</option>
                        <option>25</option>
                        <option>50</option>
                      </select>
                      <span>por página</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Número</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Fornecedor</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Data</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Valor</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[1, 2, 3].map((_, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm">NF-e {54321 - index}</td>
                        <td className="px-6 py-4 text-sm">Fornecedor {['Alpha', 'Beta', 'Gamma'][index]}</td>
                        <td className="px-6 py-4 text-sm">14/03/2025</td>
                        <td className="px-6 py-4 text-sm">R$ {(3500 + index * 800).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            index === 0 ? 'bg-green-100 text-green-700' :
                            index === 1 ? 'bg-amber-100 text-amber-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {index === 0 ? 'Conferida' : index === 1 ? 'Pendente' : 'Em Análise'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                              <Download size={18} />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                              <Printer size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Mostrando 1-3 de 85 notas</span>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1 text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100">
                      Anterior
                    </button>
                    <button className="px-3 py-1 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                      1
                    </button>
                    <button className="px-3 py-1 text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100">
                      2
                    </button>
                    <button className="px-3 py-1 text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100">
                      3
                    </button>
                    <button className="px-3 py-1 text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100">
                      Próxima
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Tabs.Content>

          <Tabs.Content value="relatorios" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-xl shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <FileBarChart className="text-blue-600" size={24} />
                  <h3 className="text-lg font-semibold">Relatório Mensal</h3>
                </div>
                <p className="text-gray-600 mb-4">Análise detalhada das notas fiscais do mês.</p>
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Gerar Relatório
                </button>
              </div>

              <div className="p-6 bg-white rounded-xl shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <FileCheck className="text-blue-600" size={24} />
                  <h3 className="text-lg font-semibold">SPED Fiscal</h3>
                </div>
                <p className="text-gray-600 mb-4">Geração do arquivo SPED Fiscal.</p>
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Gerar SPED
                </button>
              </div>

              <div className="p-6 bg-white rounded-xl shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign className="text-blue-600" size={24} />
                  <h3 className="text-lg font-semibold">Apuração de Impostos</h3>
                </div>
                <p className="text-gray-600 mb-4">Relatório de apuração de impostos do período.</p>
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Gerar Apuração
                </button>
              </div>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </main>
    </div>
  );
};

export default NotasFiscais;
import { useState } from 'react';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { ptBR } from 'date-fns/locale';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import {
  DollarSign, Plus, Filter, Search,
  TrendingUp, ArrowUpRight, ArrowDownRight,
  Star, AlertTriangle, X
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

const expensesByCategory = [
  { name: 'Operacional', value: 35 },
  { name: 'Marketing', value: 25 },
  { name: 'Pessoal', value: 30 },
  { name: 'Outros', value: 10 },
];

const monthlyRevenue = [
  { name: 'Jan', revenue: 50000, expenses: 35000 },
  { name: 'Fev', revenue: 55000, expenses: 37000 },
  { name: 'Mar', revenue: 58000, expenses: 36000 },
  { name: 'Abr', revenue: 62000, expenses: 38000 },
  { name: 'Mai', revenue: 65000, expenses: 40000 },
  { name: 'Jun', revenue: 68000, expenses: 41000 },
];

const Financeiro = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;

  // Form state
  const [formData, setFormData] = useState({
    type: '',
    category: '',
    amount: '',
    date: new Date(),
    description: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.type) {
      errors.type = 'Tipo é obrigatório';
    }

    if (!formData.category) {
      errors.category = 'Categoria é obrigatória';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      errors.amount = 'Valor deve ser maior que zero';
    }

    if (!formData.date) {
      errors.date = 'Data é obrigatória';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when field is modified
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleDateChange = (date: Date | null) => {
    setFormData(prev => ({
      ...prev,
      date: date || new Date()
    }));
    if (formErrors.date) {
      setFormErrors(prev => ({
        ...prev,
        date: ''
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // TODO: Submit transaction
      console.log('Form submitted:', formData);
      // Reset form
      setFormData({
        type: '',
        category: '',
        amount: '',
        date: new Date(),
        description: '',
      });
      // Close modal (assuming we have access to Dialog.Close ref)
      const closeButton = document.querySelector('[aria-label="Close"]');
      if (closeButton instanceof HTMLButtonElement) {
        closeButton.click();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-400">
      {/* Header Fixo */}
      <header className="sticky top-0 z-10 backdrop-blur-sm bg-opacity-90">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-green-100 rounded-xl">
                <DollarSign size={24} className="text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Financeiro</h1>
                <p className="text-sm text-gray-500">Gestão financeira e controle de gastos</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Dialog.Root>
                <Dialog.Trigger asChild>
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                    <Plus size={20} />
                    <span className="font-medium">Nova Transação</span>
                  </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                  <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-3xl max-h-[85vh] overflow-y-auto rounded-xl shadow-lg bg-white p-6">
                    <div className="flex justify-between items-center mb-6">
                      <Dialog.Title className="text-lg font-semibold">Nova Transação</Dialog.Title>
                      <Dialog.Close className="p-1 rounded-full hover:bg-gray-100">
                        <X size={20} className="text-gray-500" />
                      </Dialog.Close>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Tipo
                            {formErrors.type && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          <select
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 rounded-lg bg-white border ${
                              formErrors.type ? 'border-red-500' : 'border-gray-300'
                            }`}
                          >
                            <option value="">Selecione...</option>
                            <option value="receita">Receita</option>
                            <option value="despesa">Despesa</option>
                          </select>
                          {formErrors.type && (
                            <p className="mt-1 text-sm text-red-500">{formErrors.type}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Categoria
                            {formErrors.category && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 rounded-lg bg-white border ${
                              formErrors.category ? 'border-red-500' : 'border-gray-300'
                            }`}
                          >
                            <option value="">Selecione...</option>
                            <option value="operacional">Operacional</option>
                            <option value="marketing">Marketing</option>
                            <option value="pessoal">Pessoal</option>
                            <option value="outros">Outros</option>
                          </select>
                          {formErrors.category && (
                            <p className="mt-1 text-sm text-red-500">{formErrors.category}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Valor
                            {formErrors.amount && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleInputChange}
                            step="0.01"
                            min="0"
                            className={`w-full px-3 py-2 rounded-lg bg-white border ${
                              formErrors.amount ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="0,00"
                          />
                          {formErrors.amount && (
                            <p className="mt-1 text-sm text-red-500">{formErrors.amount}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Data
                            {formErrors.date && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          <DatePicker
                            selected={formData.date}
                            onChange={handleDateChange}
                            className={`w-full px-3 py-2 rounded-lg bg-white border ${
                              formErrors.date ? 'border-red-500' : 'border-gray-300'
                            }`}
                            dateFormat="dd/MM/yyyy"
                            locale={ptBR}
                          />
                          {formErrors.date && (
                            <p className="mt-1 text-sm text-red-500">{formErrors.date}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Descrição</label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300"
                          rows={3}
                          placeholder="Detalhes da transação"
                        />
                      </div>

                      <div className="flex justify-end gap-4">
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
                          className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
                        >
                          Salvar Transação
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
              value="transactions"
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'transactions'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Transações
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
                  <span className="text-sm font-medium text-gray-500">Receitas</span>
                  <span className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp size={20} className="text-green-600" />
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-2xl font-bold">R$ 68.000</span>
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <ArrowUpRight size={16} className="text-green-500" />
                  <span className="text-green-500 font-medium">12%</span>
                  <span className="text-gray-500 ml-2">vs. mês anterior</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Despesas</span>
                  <span className="p-2 bg-red-100 rounded-lg">
                    <TrendingUp size={20} className="text-red-600" />
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-2xl font-bold">R$ 41.000</span>
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <ArrowUpRight size={16} className="text-red-500" />
                  <span className="text-red-500 font-medium">8%</span>
                  <span className="text-gray-500 ml-2">vs. mês anterior</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Lucro</span>
                  <span className="p-2 bg-blue-100 rounded-lg">
                    <Star size={20} className="text-blue-600" />
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-2xl font-bold">R$ 27.000</span>
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <ArrowUpRight size={16} className="text-blue-500" />
                  <span className="text-blue-500 font-medium">15%</span>
                  <span className="text-gray-500 ml-2">vs. mês anterior</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Contas a Pagar</span>
                  <span className="p-2 bg-amber-100 rounded-lg">
                    <AlertTriangle size={20} className="text-amber-600" />
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-2xl font-bold">R$ 12.500</span>
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <ArrowDownRight size={16} className="text-amber-500" />
                  <span className="text-amber-500 font-medium">5%</span>
                  <span className="text-gray-500 ml-2">vs. mês anterior</span>
                </div>
              </div>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Receitas vs Despesas</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="revenue" name="Receitas" fill="#10B981" />
                      <Bar dataKey="expenses" name="Despesas" fill="#EF4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Despesas por Categoria</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expensesByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {expensesByCategory.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </Tabs.Content>

          <Tabs.Content value="transactions" className="space-y-6">
            {/* Filtros e Busca */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar transações..."
                    className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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

            {/* Lista de Transações */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                      <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                      <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[...Array(5)].map((_, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {format(new Date(2024, 2, 12 - index), 'dd/MM/yyyy')}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          Pagamento de Fornecedor
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          Operacional
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Despesa
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-sm text-gray-900">
                          R$ 2.500,00
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Tabs.Content>

          <Tabs.Content value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-xl shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign size={24} className="text-gray-400" />
                  <h3 className="text-lg font-semibold">DRE</h3>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Demonstração do Resultado do Exercício com análise detalhada de receitas e despesas.
                </p>
                <button className="w-full px-4 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  Gerar Relatório
                </button>
              </div>

              <div className="p-6 bg-white rounded-xl shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp size={24} className="text-gray-400" />
                  <h3 className="text-lg font-semibold">Fluxo de Caixa</h3>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Análise completa do fluxo de caixa com projeções e tendências.
                </p>
                <button className="w-full px-4 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  Gerar Relatório
                </button>
              </div>

              <div className="p-6 bg-white rounded-xl shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle size={24} className="text-gray-400" />
                  <h3 className="text-lg font-semibold">Contas a Pagar</h3>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Relatório detalhado de contas a pagar com datas de vencimento.
                </p>
                <button className="w-full px-4 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  Gerar Relatório
                </button>
              </div>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </main>
    </div>
  );
};

export default Financeiro;
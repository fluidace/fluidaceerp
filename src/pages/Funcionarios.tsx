import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { ptBR } from 'date-fns/locale';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import {
  Users, UserPlus, Filter, Search,
  TrendingUp, AlertTriangle, X, ArrowUpRight, ArrowDownRight,
  BriefcaseIcon, Award, Clock
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import { createEmployee, getEmployees, updateEmployee, deleteEmployee, Employee } from '../lib/employees';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

const productivityData = [
  { month: 'Jan', produtividade: 85, meta: 80 },
  { month: 'Fev', produtividade: 88, meta: 80 },
  { month: 'Mar', produtividade: 82, meta: 80 },
  { month: 'Abr', produtividade: 91, meta: 85 },
  { month: 'Mai', produtividade: 87, meta: 85 },
  { month: 'Jun', produtividade: 93, meta: 85 },
];

const departmentDistribution = [
  { name: 'Vendas', value: 30 },
  { name: 'Suporte', value: 25 },
  { name: 'Técnico', value: 20 },
  { name: 'Financeiro', value: 15 },
];

const Funcionarios = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setIsLoading(true);
      const data = await getEmployees();
      setEmployees(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar funcionários');
      console.error('Error loading employees:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEmployee = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    
    try {
      setIsLoading(true);
      setError(null);

      const status = formData.get('status') as string;
      if (!['Ativo', 'Inativo', 'Férias', 'Licença'].includes(status)) {
        throw new Error('Status inválido');
      }

      const employeeData = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        document: formData.get('document') as string,
        position: formData.get('position') as string,
        department: formData.get('department') as string,
        phone: formData.get('phone') as string,
        address: formData.get('address') as string,
        salary: parseFloat(formData.get('salary') as string),
        productivity: parseFloat(formData.get('productivity') as string),
        hire_date: formData.get('hire_date') as string,
        status: status as 'Ativo' | 'Inativo' | 'Férias' | 'Licença',
        notes: formData.get('notes') as string,
      };

      const newEmployee = await createEmployee(employeeData);
      setEmployees(prev => [newEmployee, ...prev]);
      form.reset();
      
      // Close modal
      const closeButton = form.querySelector('[aria-label="Close"]');
      if (closeButton instanceof HTMLButtonElement) {
        closeButton.click();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar funcionário');
      console.error('Error creating employee:', err);
    } finally {
      setIsLoading(false);
    }
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
                <h1 className="text-2xl font-bold">Funcionários</h1>
                <p className="text-sm text-gray-500">Gestão de colaboradores</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Dialog.Root>
                <Dialog.Trigger asChild>
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    <UserPlus size={20} />
                    <span className="font-medium">Novo Funcionário</span>
                  </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                  <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-3xl max-h-[85vh] overflow-y-auto rounded-xl shadow-lg bg-white p-6">
                    <div className="flex justify-between items-center mb-6">
                      <Dialog.Title className="text-lg font-semibold">Novo Funcionário</Dialog.Title>
                      <Dialog.Close className="p-1 rounded-full hover:bg-gray-100">
                        <X size={20} className="text-gray-500" />
                      </Dialog.Close>
                    </div>
                    
                    <form onSubmit={handleCreateEmployee} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Nome Completo</label>
                          <input
                            type="text"
                            name="name"
                            required
                            className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300"
                            placeholder="Nome do funcionário"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">E-mail</label>
                          <input
                            type="email"
                            name="email"
                            required
                            className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300"
                            placeholder="email@exemplo.com"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">CPF</label>
                          <input
                            type="text"
                            name="document"
                            required
                            className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300"
                            placeholder="000.000.000-00"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Telefone</label>
                          <input
                            type="tel"
                            name="phone"
                            required
                            className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300"
                            placeholder="(00) 00000-0000"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Cargo</label>
                          <input
                            type="text"
                            name="position"
                            required
                            className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300"
                            placeholder="Cargo do funcionário"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Departamento</label>
                          <select
                            name="department"
                            required
                            className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300"
                          >
                            <option value="">Selecione...</option>
                            <option value="vendas">Vendas</option>
                            <option value="suporte">Suporte</option>
                            <option value="tecnico">Técnico</option>
                            <option value="financeiro">Financeiro</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Data de Admissão</label>
                          <input
                            type="date"
                            name="hire_date"
                            required
                            className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Status</label>
                          <select
                            name="status"
                            required
                            className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300"
                          >
                            <option value="">Selecione...</option>
                            <option value="Ativo">Ativo</option>
                            <option value="Inativo">Inativo</option>
                            <option value="Férias">Férias</option>
                            <option value="Licença">Licença</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Salário</label>
                          <input
                            type="number"
                            name="salary"
                            step="0.01"
                            min="0"
                            required
                            className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300"
                            placeholder="0,00"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Produtividade (%)</label>
                          <input
                            type="number"
                            name="productivity"
                            min="0"
                            max="100"
                            className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300"
                            placeholder="0"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Endereço</label>
                        <input
                          type="text"
                          name="address"
                          className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300"
                          placeholder="Rua, número, bairro, cidade - UF"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Observações</label>
                        <textarea
                          name="notes"
                          className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300"
                          rows={3}
                          placeholder="Observações sobre o funcionário"
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
                          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        >
                          Salvar Funcionário
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
              value="employees"
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'employees'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Funcionários
            </Tabs.Trigger>
            <Tabs.Trigger
              value="attendance"
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'attendance'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Ponto
            </Tabs.Trigger>
          </Tabs.List>

          {/* Conteúdo das Tabs */}
          <Tabs.Content value="overview" className="space-y-6">
            {/* Cards de Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Total de Funcionários</span>
                  <span className="p-2 bg-blue-100 rounded-lg">
                    <Users size={20} className="text-blue-600" />
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-2xl font-bold">{employees.length}</span>
                  <span className="text-sm text-gray-500 ml-2">funcionários</span>
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <ArrowUpRight size={16} className="text-green-500" />
                  <span className="text-green-500 font-medium">8%</span>
                  <span className="text-gray-500 ml-2">vs. mês anterior</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Produtividade Média</span>
                  <span className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp size={20} className="text-green-600" />
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-2xl font-bold">87%</span>
                  <span className="text-sm text-gray-500 ml-2">média</span>
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <ArrowUpRight size={16} className="text-green-500" />
                  <span className="text-green-500 font-medium">5%</span>
                  <span className="text-gray-500 ml-2">vs. meta</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Horas Trabalhadas</span>
                  <span className="p-2 bg-purple-100 rounded-lg">
                    <Clock size={20} className="text-purple-600" />
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-2xl font-bold">168h</span>
                  <span className="text-sm text-gray-500 ml-2">total</span>
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <ArrowUpRight size={16} className="text-green-500" />
                  <span className="text-green-500 font-medium">2%</span>
                  <span className="text-gray-500 ml-2">vs. meta</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Ausências</span>
                  <span className="p-2 bg-amber-100 rounded-lg">
                    <AlertTriangle size={20} className="text-amber-600" />
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-2xl font-bold">3</span>
                  <span className="text-sm text-gray-500 ml-2">funcionários</span>
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
                <h3 className="text-base font-medium mb-4">Produtividade por Mês</h3>
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={productivityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="month" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip 
                        formatter={(value: number) => `${value}%`}
                        labelStyle={{ color: '#111827' }}
                        contentStyle={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.5rem' }}
                      />
                      <Legend />
                      <Bar 
                        dataKey="produtividade" 
                        name="Produtividade" 
                        fill="#10B981"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar 
                        dataKey="meta" 
                        name="Meta" 
                        fill="#3B82F6"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-base font-medium mb-4">Distribuição por Departamento</h3>
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={departmentDistribution}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#10B981"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {departmentDistribution.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value} funcionários`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </Tabs.Content>

          <Tabs.Content value="employees" className="space-y-6">
            {/* Filtros e Busca */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar funcionários..."
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
                  onChange={(update) => {
                    setDateRange(update);
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
                    <label className="block text-sm font-medium mb-1">Departamento</label>
                    <select className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg">
                      <option value="">Todos</option>
                      <option value="vendas">Vendas</option>
                      <option value="suporte">Suporte</option>
                      <option value="tecnico">Técnico</option>
                      <option value="financeiro">Financeiro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg">
                      <option value="">Todos</option>
                      <option value="Ativo">Ativo</option>
                      <option value="Inativo">Inativo</option>
                      <option value="Férias">Férias</option>
                      <option value="Licença">Licença</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Data de Admissão</label>
                    <DatePicker
                      selectsRange
                      startDate={startDate}
                      endDate={endDate}
                      onChange={(update) => {
                        setDateRange(update);
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

            {/* Lista de Funcionários */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Funcionário</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Cargo</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Departamento</th>
                      <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Produtividade</th>
                      <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                          <div className="flex items-center justify-center gap-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
                            Carregando...
                          </div>
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-red-600">
                          {error}
                        </td>
                      </tr>
                    ) : employees.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                          Nenhum funcionário encontrado
                        </td>
                      </tr>
                    ) : (
                      employees.map((employee) => (
                        <tr key={employee.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <button
                              onClick={() => setSelectedEmployee(employee)}
                              className="flex items-center group"
                            >
                              <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Users size={20} className="text-blue-600" />
                              </div>
                              <div className="ml-4 text-left">
                                <div className="text-sm font-medium text-blue-600 group-hover:text-blue-800 group-hover:underline">
                                  {employee.name}
                                </div>
                                <div className="text-sm text-gray-500">{employee.email}</div>
                              </div>
                            </button>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">{employee.position}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{employee.department}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="text-sm text-gray-900">{employee.productivity}%</div>
                            <div className="text-sm text-gray-500">
                              Meta: 85%
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                              ${employee.status === 'Ativo' ? 'bg-green-100 text-green-800' : ''}
                              ${employee.status === 'Inativo' ? 'bg-red-100 text-red-800' : ''}
                              ${employee.status === 'Férias' ? 'bg-blue-100 text-blue-800' : ''}
                              ${employee.status === 'Licença' ? 'bg-amber-100 text-amber-800' : ''}`}
                            >
                              {employee.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Tabs.Content>

          <Tabs.Content value="attendance" className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-base font-medium mb-4">Registro de Ponto</h3>
              <p className="text-gray-500">Esta seção está em desenvolvimento.</p>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </main>

      {/* Modal de Detalhes do Funcionário */}
      <Dialog.Root open={!!selectedEmployee} onOpenChange={(open) => !open && setSelectedEmployee(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-3xl max-h-[85vh] overflow-y-auto rounded-xl shadow-lg bg-white p-6">
            <div className="flex justify-between items-center mb-6">
              <Dialog.Title className="text-lg font-semibold">Detalhes do Funcionário</Dialog.Title>
              <Dialog.Close className="p-1 rounded-full hover:bg-gray-100">
                <X size={20} className="text-gray-500" />
              </Dialog.Close>
            </div>

            {selectedEmployee && (
              <div className="space-y-6">
                {/* Informações Básicas */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Informações Básicas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Nome Completo</h4>
                      <p className="text-sm">{selectedEmployee.name}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">E-mail</h4>
                      <p className="text-sm">{selectedEmployee.email}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">CPF</h4>
                      <p className="text-sm">{selectedEmployee.document}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Telefone</h4>
                      <p className="text-sm">{selectedEmployee.phone}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Status</h4>
                      <span className={`mt-1 px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${selectedEmployee.status === 'Ativo' ? 'bg-green-100 text-green-800' : ''}
                        ${selectedEmployee.status === 'Inativo' ? 'bg-red-100 text-red-800' : ''}
                        ${selectedEmployee.status === 'Férias' ? 'bg-blue-100 text-blue-800' : ''}
                        ${selectedEmployee.status === 'Licença' ? 'bg-yellow-100 text-yellow-800' : ''}`}
                      >
                        {selectedEmployee.status}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Data de Contratação</h4>
                      <p className="text-sm">{new Date(selectedEmployee.hire_date).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                </div>

                {/* Informações Profissionais */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Informações Profissionais</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Cargo</h4>
                      <p className="text-sm">{selectedEmployee.position}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Departamento</h4>
                      <p className="text-sm">{selectedEmployee.department}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Salário</h4>
                      <p className="text-sm">
                        {(selectedEmployee?.salary ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Produtividade</h4>
                      <div className="flex items-center gap-2">
                        <span className={`inline-block w-2 h-2 rounded-full ${
                          (selectedEmployee?.productivity ?? 0) >= 90 ? 'bg-green-500' :
                          (selectedEmployee?.productivity ?? 0) >= 70 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`} />
                        <p className="text-sm">{selectedEmployee?.productivity ?? 0}%</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Endereço */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Endereço</h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm">{selectedEmployee.address}</p>
                  </div>
                </div>

                {/* Observações */}
                {selectedEmployee.notes && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Observações</h3>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm whitespace-pre-wrap">{selectedEmployee.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default Funcionarios;
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import {
  Users, UserPlus, Download, Filter, Search,
  TrendingUp, TrendingDown, Clock, FileText,
  Calendar, DollarSign, Star, Award, AlertTriangle,
  Moon, Sun, Plus, Edit, CheckCircle2, XCircle,
  ClipboardList, BriefcaseIcon, Trash2
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import { createEmployee, getEmployees, updateEmployee, deleteEmployee, Employee } from '../lib/employees';

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
  { name: 'Administrativo', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const services = [
  {
    id: 1,
    employee: 'João Silva',
    service: 'Venda #1234',
    client: 'Tech Solutions Ltda',
    status: 'Concluído',
    date: '2024-03-20',
    duration: '2h 30min',
    evaluation: 5,
  },
  {
    id: 2,
    employee: 'Maria Santos',
    service: 'Suporte Técnico #567',
    client: 'Maria Consultoria',
    status: 'Em andamento',
    date: '2024-03-19',
    duration: '1h 45min',
    evaluation: null,
  },
  {
    id: 3,
    employee: 'Pedro Costa',
    service: 'Análise Financeira #890',
    client: 'João Comércio ME',
    status: 'Agendado',
    date: '2024-03-21',
    duration: null,
    evaluation: null,
  },
];

const timeRecords = [
  {
    id: 1,
    employee: 'João Silva',
    type: 'Entrada',
    time: '08:00',
    date: '2024-03-20',
    status: 'Normal',
  },
  {
    id: 2,
    employee: 'João Silva',
    type: 'Saída',
    time: '17:00',
    date: '2024-03-20',
    status: 'Normal',
  },
  {
    id: 3,
    employee: 'Maria Santos',
    type: 'Entrada',
    time: '08:15',
    date: '2024-03-20',
    status: 'Atrasado',
  },
];

const Funcionarios = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('funcionarios');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

      const employeeData = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        document: formData.get('document') as string,
        position: formData.get('position') as string,
        department: formData.get('department') as string,
        phone: formData.get('phone') as string,
        address: formData.get('address') as string,
        salary: Number(formData.get('salary')) || 0,
        hire_date: formData.get('hire_date') as string,
        status: formData.get('status') as 'Ativo' | 'Inativo' | 'Férias' | 'Licença',
        notes: formData.get('notes') as string,
      };

      const newEmployee = await createEmployee(employeeData);
      setEmployees(prev => [newEmployee, ...prev]);
      setIsDialogOpen(false);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar funcionário');
      console.error('Error creating employee:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este funcionário?')) {
      return;
    }

    try {
      setIsLoading(true);
      await deleteEmployee(id);
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir funcionário');
      console.error('Error deleting employee:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    try {
      return format(new Date(date), 'dd/MM/yyyy');
    } catch (err) {
      console.error('Error formatting date:', err);
      return '-';
    }
  };

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Gestão de Funcionários</h1>
            <p className="text-gray-500 mt-1">Gerencie sua equipe e serviços</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <Dialog.Trigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                  <UserPlus size={20} /> Novo Funcionário
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                <Dialog.Content className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 w-full max-w-2xl`}>
                  <Dialog.Title className="text-xl font-bold mb-4">Cadastrar Novo Funcionário</Dialog.Title>
                  {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                      {error}
                    </div>
                  )}
                  <form onSubmit={handleCreateEmployee} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Nome Completo</label>
                        <input
                          type="text"
                          name="name"
                          required
                          className="w-full px-3 py-2 border rounded-lg"
                          placeholder="Nome completo"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">CPF</label>
                        <input
                          type="text"
                          name="document"
                          className="w-full px-3 py-2 border rounded-lg"
                          placeholder="000.000.000-00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Cargo</label>
                        <input
                          type="text"
                          name="position"
                          className="w-full px-3 py-2 border rounded-lg"
                          placeholder="Cargo"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Departamento</label>
                        <select
                          name="department"
                          className="w-full px-3 py-2 border rounded-lg"
                        >
                          <option value="Vendas">Vendas</option>
                          <option value="Suporte">Suporte</option>
                          <option value="Técnico">Técnico</option>
                          <option value="Financeiro">Financeiro</option>
                          <option value="Administrativo">Administrativo</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Data de Admissão</label>
                        <input
                          type="date"
                          name="hire_date"
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Salário</label>
                        <input
                          type="number"
                          name="salary"
                          className="w-full px-3 py-2 border rounded-lg"
                          placeholder="0,00"
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
                        <label className="block text-sm font-medium mb-1">Status</label>
                        <select
                          name="status"
                          className="w-full px-3 py-2 border rounded-lg"
                        >
                          <option value="Ativo">Ativo</option>
                          <option value="Inativo">Inativo</option>
                          <option value="Férias">Férias</option>
                          <option value="Licença">Licença</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Endereço</label>
                      <input
                        type="text"
                        name="address"
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="Rua, número, complemento"
                      />
                    </div>
                    <div>
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
                        {isLoading ? 'Salvando...' : 'Salvar Funcionário'}
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
                <p className="text-sm text-gray-500">Total de Funcionários</p>
                <h3 className="text-2xl font-bold">{employees.length}</h3>
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
                <p className="text-sm text-gray-500">Média Salarial</p>
                <h3 className="text-2xl font-bold">
                  R$ {(employees.reduce((acc, emp) => acc + (emp.salary || 0), 0) / (employees.length || 1)).toFixed(2)}
                </h3>
                <p className="text-sm text-green-500 flex items-center mt-2">
                  <TrendingUp size={16} className="mr-1" /> +5.2%
                </p>
              </div>
              <DollarSign size={40} className="text-blue-500" />
            </div>
          </div>

          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Produtividade Média</p>
                <h3 className="text-2xl font-bold">
                  {(employees.reduce((acc, emp) => acc + (emp.productivity || 0), 0) / (employees.length || 1)).toFixed(0)}%
                </h3>
                <p className="text-sm text-green-500 flex items-center mt-2">
                  <TrendingUp size={16} className="mr-1" /> +3.8%
                </p>
              </div>
              <Star size={40} className="text-blue-500" />
            </div>
          </div>

          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Serviços em Andamento</p>
                <h3 className="text-2xl font-bold">12</h3>
                <p className="text-sm text-yellow-500 flex items-center mt-2">
                  <Clock size={16} className="mr-1" /> Em progresso
                </p>
              </div>
              <BriefcaseIcon size={40} className="text-blue-500" />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
            <h3 className="text-xl font-semibold mb-4">Produtividade vs Meta</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={productivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="produtividade" stroke="#10B981" name="Produtividade" />
                  <Line type="monotone" dataKey="meta" stroke="#6366F1" name="Meta" strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
            <h3 className="text-xl font-semibold mb-4">Distribuição por Departamento</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {departmentDistribution.map((entry, index) => (
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
              value="funcionarios"
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'funcionarios'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Funcionários
            </Tabs.Trigger>
            <Tabs.Trigger
              value="servicos"
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'servicos'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Serviços
            </Tabs.Trigger>
            <Tabs.Trigger
              value="ponto"
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'ponto'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Registro de Ponto
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="funcionarios">
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg mb-8`}>
              <div className="flex justify-between items-center mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Buscar funcionários..."
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
                      <th className="text-left py-3">Funcionário</th>
                      <th className="text-left py-3">Cargo</th>
                      <th className="text-left py-3">Departamento</th>
                      <th className="text-left py-3">Status</th>
                      <th className="text-left py-3">Produtividade</th>
                      <th className="text-left py-3">Salário</th>
                      <th className="text-left py-3">Data de Admissão</th>
                      <th className="text-left py-3">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((employee) => (
                      <tr key={employee.id} className="border-b">
                        <td className="py-3">{employee.name}</td>
                        <td className="py-3">{employee.position}</td>
                        <td className="py-3">{employee.department}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              employee.status === 'Ativo'
                                ? 'bg-green-100 text-green-800'
                                : employee.status === 'Férias'
                                ? 'bg-blue-100 text-blue-800'
                                : employee.status === 'Licença'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {employee.status}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center">
                            {employee.productivity}%
                            {employee.productivity >= 90 && (
                              <Award size={16} className="ml-2 text-green-500" />
                            )}
                          </div>
                        </td>
                        <td className="py-3">R$ {employee.salary?.toFixed(2)}</td>
                        <td className="py-3">{formatDate(employee.hire_date)}</td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            <button className="text-blue-600 hover:text-blue-800">
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteEmployee(employee.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 size={18} />
                            </button>
                            <button className="text-green-600 hover:text-green-800">
                              <FileText size={18} />
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

          <Tabs.Content value="servicos">
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
                    <Plus size={20} /> Novo Serviço
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3">Funcionário</th>
                      <th className="text-left py-3">Serviço</th>
                      <th className="text-left py-3">Cliente</th>
                      <th className="text-left py-3">Status</th>
                      <th className="text-left py-3">Data</th>
                      <th className="text-left py-3">Duração</th>
                      <th className="text-left py-3">Avaliação</th>
                      <th className="text-left py-3">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((service) => (
                      <tr key={service.id} className="border-b">
                        <td className="py-3">{service.employee}</td>
                        <td className="py-3">{service.service}</td>
                        <td className="py-3">{service.client}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              service.status === 'Concluído'
                                ? 'bg-green-100 text-green-800'
                                : service.status === 'Em andamento'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {service.status}
                          </span>
                        </td>
                        <td className="py-3">{formatDate(service.date)}</td>
                        <td className="py-3">{service.duration || '-'}</td>
                        <td className="py-3">
                          {service.evaluation ? (
                            <div className="flex items-center">
                              <Star size={16} className="text-yellow-500" />
                              <span className="ml-1">{service.evaluation}</span>
                            </div>
                          ) : (
                            '-'
                          )}
                        </td>
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

          <Tabs.Content value="ponto">
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
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors">
                    <CheckCircle2 size={20} /> Registrar Entrada
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors">
                    <XCircle size={20} /> Registrar Saída
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3">Funcionário</th>
                      <th className="text-left py-3">Tipo</th>
                      <th className="text-left py-3">Horário</th>
                      <th className="text-left py-3">Data</th>
                      <th className="text-left py-3">Status</th>
                      <th className="text-left py-3">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timeRecords.map((record) => (
                      <tr key={record.id} className="border-b">
                        <td className="py-3">{record.employee}</td>
                        <td className="py-3">{record.type}</td>
                        <td className="py-3">{record.time}</td>
                        <td className="py-3">{formatDate(record.date)}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              record.status === 'Normal'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {record.status}
                          </span>
                        </td>
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

export default Funcionarios;
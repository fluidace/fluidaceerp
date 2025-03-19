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
  ShoppingBag, Plus, Filter, Search,
  TrendingUp, ArrowUpRight, ArrowDownRight,
  Star, AlertTriangle, X, Truck
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';

const purchaseData = [
  { month: 'Jan', compras: 45000, meta: 50000 },
  { month: 'Fev', compras: 52000, meta: 50000 },
  { month: 'Mar', compras: 49000, meta: 50000 },
  { month: 'Abr', compras: 63000, meta: 55000 },
  { month: 'Mai', compras: 58000, meta: 55000 },
  { month: 'Jun', compras: 72000, meta: 60000 },
];

const purchaseByCategory = [
  { name: 'Matéria-prima', value: 45 },
  { name: 'Equipamentos', value: 25 },
  { name: 'Suprimentos', value: 20 },
  { name: 'Serviços', value: 10 },
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

const Compras = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;

  // Form state
  const [formData, setFormData] = useState({
    supplier: '',
    orderDate: new Date(),
    deliveryDate: new Date(),
    paymentMethod: '',
    items: [] as Array<{
      product: string;
      quantity: string;
      unitPrice: string;
      total: number;
    }>,
    notes: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.supplier) {
      errors.supplier = 'Fornecedor é obrigatório';
    }
    
    if (!formData.orderDate) {
      errors.orderDate = 'Data do pedido é obrigatória';
    }
    
    if (!formData.deliveryDate) {
      errors.deliveryDate = 'Data de entrega é obrigatória';
    }
    
    if (!formData.paymentMethod) {
      errors.paymentMethod = 'Método de pagamento é obrigatório';
    }

    if (formData.items.length === 0) {
      errors.items = 'Adicione pelo menos um item';
    }

    formData.items.forEach((item, index) => {
      if (!item.product) {
        errors[`items.${index}.product`] = 'Produto é obrigatório';
      }
      if (!item.quantity || parseFloat(item.quantity) <= 0) {
        errors[`items.${index}.quantity`] = 'Quantidade deve ser maior que zero';
      }
      if (!item.unitPrice || parseFloat(item.unitPrice) <= 0) {
        errors[`items.${index}.unitPrice`] = 'Preço unitário deve ser maior que zero';
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleDateChange = (date: Date | null, field: 'orderDate' | 'deliveryDate') => {
    setFormData(prev => ({
      ...prev,
      [field]: date || new Date()
    }));
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // TODO: Submit purchase order
      console.log('Form submitted:', formData);
      // Reset form
      setFormData({
        supplier: '',
        orderDate: new Date(),
        deliveryDate: new Date(),
        paymentMethod: '',
        items: [],
        notes: '',
      });
      // Close modal
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
              <div className="p-2.5 bg-blue-100 rounded-xl">
                <ShoppingBag size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Compras</h1>
                <p className="text-sm text-gray-500">Gestão de pedidos e fornecedores</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Dialog.Root>
                <Dialog.Trigger asChild>
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    <Plus size={20} />
                    <span className="font-medium">Novo Pedido</span>
                  </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                  <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-3xl max-h-[85vh] overflow-y-auto rounded-xl shadow-lg bg-white p-6">
                    <div className="flex justify-between items-center mb-6">
                      <Dialog.Title className="text-lg font-semibold">Novo Pedido de Compra</Dialog.Title>
                      <Dialog.Close className="p-1 rounded-full hover:bg-gray-100">
                        <X size={20} className="text-gray-500" />
                      </Dialog.Close>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Fornecedor
                            {formErrors.supplier && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          <select
                            name="supplier"
                            value={formData.supplier}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 rounded-lg bg-white border ${
                              formErrors.supplier ? 'border-red-500' : 'border-gray-300'
                            }`}
                          >
                            <option value="">Selecione...</option>
                            <option value="1">Tech Distribuidora</option>
                            <option value="2">Suprimentos Express</option>
                            <option value="3">Equipamentos Pro</option>
                          </select>
                          {formErrors.supplier && (
                            <p className="mt-1 text-sm text-red-500">{formErrors.supplier}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Data do Pedido
                            {formErrors.orderDate && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          <DatePicker
                            selected={formData.orderDate}
                            onChange={(date) => handleDateChange(date, 'orderDate')}
                            className={`w-full px-3 py-2 rounded-lg bg-white border ${
                              formErrors.orderDate ? 'border-red-500' : 'border-gray-300'
                            }`}
                            dateFormat="dd/MM/yyyy"
                            locale={ptBR}
                          />
                          {formErrors.orderDate && (
                            <p className="mt-1 text-sm text-red-500">{formErrors.orderDate}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Data de Entrega
                            {formErrors.deliveryDate && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          <DatePicker
                            selected={formData.deliveryDate}
                            onChange={(date) => handleDateChange(date, 'deliveryDate')}
                            className={`w-full px-3 py-2 rounded-lg bg-white border ${
                              formErrors.deliveryDate ? 'border-red-500' : 'border-gray-300'
                            }`}
                            dateFormat="dd/MM/yyyy"
                            locale={ptBR}
                          />
                          {formErrors.deliveryDate && (
                            <p className="mt-1 text-sm text-red-500">{formErrors.deliveryDate}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Método de Pagamento
                            {formErrors.paymentMethod && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          <select
                            name="paymentMethod"
                            value={formData.paymentMethod}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 rounded-lg bg-white border ${
                              formErrors.paymentMethod ? 'border-red-500' : 'border-gray-300'
                            }`}
                          >
                            <option value="">Selecione...</option>
                            <option value="dinheiro">Dinheiro</option>
                            <option value="cartao">Cartão</option>
                            <option value="boleto">Boleto</option>
                            <option value="pix">PIX</option>
                          </select>
                          {formErrors.paymentMethod && (
                            <p className="mt-1 text-sm text-red-500">{formErrors.paymentMethod}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Descrição</label>
                        <textarea
                          name="notes"
                          value={formData.notes}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300"
                          rows={3}
                          placeholder="Detalhes do pedido"
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
                          Salvar Pedido
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
              value="orders"
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'orders'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Pedidos
            </Tabs.Trigger>
            <Tabs.Trigger
              value="suppliers"
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'suppliers'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Fornecedores
            </Tabs.Trigger>
          </Tabs.List>

          {/* Conteúdo das Tabs */}
          <Tabs.Content value="overview" className="space-y-6">
            {/* Cards de Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Total de Compras</span>
                  <span className="p-2 bg-blue-100 rounded-lg">
                    <TrendingUp size={20} className="text-blue-600" />
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-2xl font-bold">R$ 72.000</span>
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <ArrowUpRight size={16} className="text-blue-500" />
                  <span className="text-blue-500 font-medium">20%</span>
                  <span className="text-gray-500 ml-2">vs. mês anterior</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Pedidos em Aberto</span>
                  <span className="p-2 bg-amber-100 rounded-lg">
                    <AlertTriangle size={20} className="text-amber-600" />
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-2xl font-bold">15</span>
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <ArrowUpRight size={16} className="text-amber-500" />
                  <span className="text-amber-500 font-medium">5</span>
                  <span className="text-gray-500 ml-2">pedidos novos</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Fornecedores Ativos</span>
                  <span className="p-2 bg-green-100 rounded-lg">
                    <Star size={20} className="text-green-600" />
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-2xl font-bold">28</span>
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <ArrowUpRight size={16} className="text-green-500" />
                  <span className="text-green-500 font-medium">3</span>
                  <span className="text-gray-500 ml-2">novos este mês</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Entregas Pendentes</span>
                  <span className="p-2 bg-blue-100 rounded-lg">
                    <Truck size={20} className="text-blue-600" />
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-2xl font-bold">8</span>
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <ArrowDownRight size={16} className="text-blue-500" />
                  <span className="text-blue-500 font-medium">2</span>
                  <span className="text-gray-500 ml-2">em trânsito</span>
                </div>
              </div>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Compras vs Meta</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={purchaseData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="compras" name="Compras" fill="#3B82F6" />
                      <Bar dataKey="meta" name="Meta" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Compras por Categoria</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={purchaseByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {purchaseByCategory.map((_, index) => (
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

          <Tabs.Content value="orders" className="space-y-6">
            {/* Filtros e Busca */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar pedidos..."
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

            {/* Lista de Pedidos */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Fornecedor</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Itens</th>
                      <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[...Array(5)].map((_, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {format(new Date(2024, 2, 20 - index), 'dd/MM/yyyy')}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          Tech Distribuidora
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Entregue
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-gray-500">
                          5
                        </td>
                        <td className="px-6 py-4 text-right text-sm text-gray-900">
                          R$ 12.500,00
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Tabs.Content>

          <Tabs.Content value="suppliers" className="space-y-6">
            {/* Lista de Fornecedores */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Fornecedor</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                      <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Confiabilidade</th>
                      <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Prazo Médio</th>
                      <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Total Compras</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[...Array(5)].map((_, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">
                          Tech Distribuidora
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          Eletrônicos
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            98%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-gray-500">
                          3 dias
                        </td>
                        <td className="px-6 py-4 text-right text-sm text-gray-900">
                          R$ 158.900,00
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </main>
    </div>
  );
};

export default Compras;
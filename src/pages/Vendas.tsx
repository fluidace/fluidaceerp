import { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { ptBR } from 'date-fns/locale';
import {
  ShoppingBag, Search, Filter, Plus, X,
  ArrowUpRight, ArrowDownRight,
  DollarSign, TrendingUp
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

const salesData = [
  { month: 'Jan', vendas: 45, canceladas: 2 },
  { month: 'Fev', vendas: 52, canceladas: 1 },
  { month: 'Mar', vendas: 48, canceladas: 3 },
  { month: 'Abr', vendas: 63, canceladas: 2 },
  { month: 'Mai', vendas: 58, canceladas: 1 },
  { month: 'Jun', vendas: 72, canceladas: 4 },
];

const salesByStatus = [
  { name: 'Concluídas', value: 65 },
  { name: 'Em Andamento', value: 25 },
  { name: 'Canceladas', value: 10 },
];

interface Product {
  id: number;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

interface SaleFormData {
  client: string;
  seller: string;
  status: string;
  origin: string;
  products: Product[];
  total: number;
  notes: string;
}

interface SaleDetails extends SaleFormData {
  id: string;
  date: string;
}

const mockSales: SaleDetails[] = [
  {
    id: '1',
    date: '2025-03-14',
    client: 'João Silva',
    seller: 'Carlos Oliveira',
    status: 'concluida',
    origin: 'loja_fisica',
    products: [
      { id: 1, name: 'Notebook Dell Inspiron', quantity: 1, price: 3500, total: 3500 },
      { id: 2, name: 'Mouse Logitech MX', quantity: 1, price: 250, total: 250 }
    ],
    total: 3750,
    notes: 'Cliente solicitou entrega em domicílio'
  },
  {
    id: '2',
    date: '2025-03-13',
    client: 'Maria Santos',
    seller: 'Ana Paula',
    status: 'andamento',
    origin: 'whatsapp',
    products: [
      { id: 1, name: 'Monitor LG 24"', quantity: 2, price: 1200, total: 2400 }
    ],
    total: 2400,
    notes: 'Aguardando confirmação de pagamento'
  }
];

const Vendas = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;
  const [selectedSale, setSelectedSale] = useState<SaleDetails | null>(null);

  // Form state
  const [formData, setFormData] = useState<SaleFormData>({
    client: '',
    seller: '',
    status: '',
    origin: '',
    products: [{ id: 1, name: '', quantity: 1, price: 0, total: 0 }],
    total: 0,
    notes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProductChange = (index: number, field: keyof Product, value: string | number) => {
    setFormData(prev => {
      const products = [...prev.products];
      products[index] = {
        ...products[index],
        [field]: value,
        total: field === 'quantity' || field === 'price'
          ? Number(products[index].quantity) * Number(products[index].price)
          : products[index].total
      };

      // Recalculate total
      const total = products.reduce((sum, product) => sum + product.total, 0);

      return {
        ...prev,
        products,
        total
      };
    });
  };

  const addProduct = () => {
    setFormData(prev => ({
      ...prev,
      products: [
        ...prev.products,
        {
          id: prev.products.length + 1,
          name: '',
          quantity: 1,
          price: 0,
          total: 0
        }
      ]
    }));
  };

  const removeProduct = (index: number) => {
    setFormData(prev => {
      const products = prev.products.filter((_, i) => i !== index);
      const total = products.reduce((sum, product) => sum + product.total, 0);
      
      return {
        ...prev,
        products,
        total
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit sale
    console.log('Form submitted:', formData);
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
                <h1 className="text-2xl font-bold">Vendas</h1>
                <p className="text-sm text-gray-500">Gestão de vendas e pedidos</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Dialog.Root>
                <Dialog.Trigger asChild>
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    <Plus size={20} />
                    <span className="font-medium">Nova Venda</span>
                  </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                  <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-3xl max-h-[85vh] overflow-y-auto rounded-xl shadow-lg bg-white p-6">
                    <div className="flex justify-between items-center mb-6">
                      <Dialog.Title className="text-lg font-semibold">Nova Venda</Dialog.Title>
                      <Dialog.Close className="p-1 rounded-full hover:bg-gray-100">
                        <X size={20} className="text-gray-500" />
                      </Dialog.Close>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Cliente</label>
                          <select
                            name="client"
                            value={formData.client}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300"
                          >
                            <option value="">Selecione...</option>
                            <option value="1">João Silva</option>
                            <option value="2">Maria Santos</option>
                            <option value="3">Pedro Costa</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Vendedor</label>
                          <select
                            name="seller"
                            value={formData.seller}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300"
                          >
                            <option value="">Selecione...</option>
                            <option value="1">Carlos Oliveira</option>
                            <option value="2">Ana Paula</option>
                            <option value="3">Roberto Santos</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Status</label>
                          <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300"
                          >
                            <option value="">Selecione...</option>
                            <option value="concluida">Concluída</option>
                            <option value="andamento">Em Andamento</option>
                            <option value="cancelada">Cancelada</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Origem da Venda</label>
                          <select
                            name="origin"
                            value={formData.origin}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300"
                          >
                            <option value="">Selecione...</option>
                            <option value="loja_fisica">Loja Física</option>
                            <option value="ecommerce">E-commerce</option>
                            <option value="whatsapp">WhatsApp</option>
                            <option value="instagram">Instagram</option>
                            <option value="marketplace">Marketplace</option>
                            <option value="outros">Outros</option>
                          </select>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-sm font-medium">Produtos/Serviços</h3>
                          <button
                            type="button"
                            onClick={addProduct}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg transition-colors"
                          >
                            <Plus size={16} />
                            Adicionar Item
                          </button>
                        </div>
                        
                        <div className="space-y-3">
                          {formData.products.map((product, index) => (
                            <div key={product.id} className="grid grid-cols-12 gap-3">
                              <div className="col-span-5">
                                <select
                                  value={product.name}
                                  onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                                  required
                                  className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-sm"
                                >
                                  <option value="">Selecione o produto...</option>
                                  <option value="1">Notebook Dell Inspiron</option>
                                  <option value="2">Monitor LG 24"</option>
                                  <option value="3">Mouse Logitech MX</option>
                                </select>
                              </div>
                              <div className="col-span-2">
                                <input
                                  type="number"
                                  value={product.quantity}
                                  onChange={(e) => handleProductChange(index, 'quantity', Number(e.target.value))}
                                  required
                                  min="1"
                                  placeholder="Qtd"
                                  className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-sm"
                                />
                              </div>
                              <div className="col-span-2">
                                <input
                                  type="number"
                                  value={product.price}
                                  onChange={(e) => handleProductChange(index, 'price', Number(e.target.value))}
                                  required
                                  step="0.01"
                                  min="0"
                                  placeholder="Preço Unit."
                                  className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-sm"
                                />
                              </div>
                              <div className="col-span-2">
                                <input
                                  type="number"
                                  value={product.total}
                                  readOnly
                                  placeholder="Total"
                                  className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-300 text-sm"
                                />
                              </div>
                              <div className="col-span-1">
                                {index > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => removeProduct(index)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                  >
                                    <X size={16} />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Valor Total</label>
                          <input
                            type="number"
                            value={formData.total}
                            readOnly
                            className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-300"
                            placeholder="0,00"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Observações</label>
                        <textarea
                          name="notes"
                          value={formData.notes}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300"
                          rows={3}
                          placeholder="Detalhes da venda"
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
                          Salvar Venda
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
              value="sales"
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'sales'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Vendas
            </Tabs.Trigger>
          </Tabs.List>

          {/* Conteúdo das Tabs */}
          <Tabs.Content value="overview" className="space-y-6">
            {/* Cards de Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Total de Vendas</span>
                  <span className="p-2 bg-blue-100 rounded-lg">
                    <ShoppingBag size={20} className="text-blue-600" />
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-2xl font-bold">338</span>
                  <span className="text-sm text-gray-500 ml-2">vendas</span>
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <ArrowUpRight size={16} className="text-green-500" />
                  <span className="text-green-500 font-medium">12%</span>
                  <span className="text-gray-500 ml-2">vs. mês anterior</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Vendas Canceladas</span>
                  <span className="p-2 bg-red-100 rounded-lg">
                    <ArrowDownRight size={20} className="text-red-600" />
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-2xl font-bold">13</span>
                  <span className="text-sm text-gray-500 ml-2">vendas</span>
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <ArrowDownRight size={16} className="text-red-500" />
                  <span className="text-red-500 font-medium">3%</span>
                  <span className="text-gray-500 ml-2">vs. mês anterior</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Ticket Médio</span>
                  <span className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp size={20} className="text-green-600" />
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-2xl font-bold">R$ 377,04</span>
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <ArrowUpRight size={16} className="text-green-500" />
                  <span className="text-green-500 font-medium">8%</span>
                  <span className="text-gray-500 ml-2">vs. mês anterior</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Faturamento</span>
                  <span className="p-2 bg-blue-100 rounded-lg">
                    <DollarSign size={20} className="text-blue-600" />
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-2xl font-bold">R$ 127.439,50</span>
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <ArrowUpRight size={16} className="text-green-500" />
                  <span className="text-green-500 font-medium">8%</span>
                  <span className="text-gray-500 ml-2">vs. mês anterior</span>
                </div>
              </div>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Evolução de Vendas</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="vendas" fill="#3B82F6" name="Vendas" />
                      <Bar dataKey="canceladas" fill="#EF4444" name="Canceladas" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Status das Vendas</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={salesByStatus}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {salesByStatus.map((_, index) => (
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
          </Tabs.Content>

          <Tabs.Content value="sales" className="space-y-6">
            {/* Filtros e Busca */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar vendas..."
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

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <select
                  className="px-3 py-2 rounded-lg border border-gray-300"
                >
                  <option value="">Status</option>
                  <option value="concluida">Concluída</option>
                  <option value="andamento">Em Andamento</option>
                  <option value="cancelada">Cancelada</option>
                </select>

                <select
                  className="px-3 py-2 rounded-lg border border-gray-300"
                >
                  <option value="">Vendedor</option>
                  <option value="carlos">Carlos Oliveira</option>
                  <option value="ana">Ana Paula</option>
                  <option value="roberto">Roberto Santos</option>
                </select>

                <select
                  className="px-3 py-2 rounded-lg border border-gray-300"
                >
                  <option value="">Cliente</option>
                  <option value="joao">João Silva</option>
                  <option value="maria">Maria Santos</option>
                  <option value="pedro">Pedro Costa</option>
                </select>
              </div>
            )}

            {/* Tabela de Vendas */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendedor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origem</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {mockSales.map((sale) => (
                      <tr key={sale.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(sale.date).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => setSelectedSale(sale)}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {sale.client}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sale.seller}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {sale.origin === 'loja_fisica' && 'Loja Física'}
                          {sale.origin === 'ecommerce' && 'E-commerce'}
                          {sale.origin === 'whatsapp' && 'WhatsApp'}
                          {sale.origin === 'instagram' && 'Instagram'}
                          {sale.origin === 'marketplace' && 'Marketplace'}
                          {sale.origin === 'outros' && 'Outros'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {sale.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${sale.status === 'concluida' ? 'bg-green-100 text-green-800' : ''}
                            ${sale.status === 'andamento' ? 'bg-yellow-100 text-yellow-800' : ''}
                            ${sale.status === 'cancelada' ? 'bg-red-100 text-red-800' : ''}
                          `}>
                            {sale.status === 'concluida' && 'Concluída'}
                            {sale.status === 'andamento' && 'Em Andamento'}
                            {sale.status === 'cancelada' && 'Cancelada'}
                          </span>
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

      {/* Modal de Detalhes da Venda */}
      <Dialog.Root open={!!selectedSale} onOpenChange={(open) => !open && setSelectedSale(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-3xl max-h-[85vh] overflow-y-auto rounded-xl shadow-lg bg-white p-6">
            <div className="flex justify-between items-center mb-6">
              <Dialog.Title className="text-lg font-semibold">Detalhes da Venda</Dialog.Title>
              <Dialog.Close className="p-1 rounded-full hover:bg-gray-100">
                <X size={20} className="text-gray-500" />
              </Dialog.Close>
            </div>

            {selectedSale && (
              <div className="space-y-6">
                {/* Informações Gerais */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Data</h3>
                    <p className="text-sm">{new Date(selectedSale.date).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Cliente</h3>
                    <p className="text-sm">{selectedSale.client}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Vendedor</h3>
                    <p className="text-sm">{selectedSale.seller}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Origem</h3>
                    <p className="text-sm">
                      {selectedSale.origin === 'loja_fisica' && 'Loja Física'}
                      {selectedSale.origin === 'ecommerce' && 'E-commerce'}
                      {selectedSale.origin === 'whatsapp' && 'WhatsApp'}
                      {selectedSale.origin === 'instagram' && 'Instagram'}
                      {selectedSale.origin === 'marketplace' && 'Marketplace'}
                      {selectedSale.origin === 'outros' && 'Outros'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${selectedSale.status === 'concluida' ? 'bg-green-100 text-green-800' : ''}
                      ${selectedSale.status === 'andamento' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${selectedSale.status === 'cancelada' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {selectedSale.status === 'concluida' && 'Concluída'}
                      {selectedSale.status === 'andamento' && 'Em Andamento'}
                      {selectedSale.status === 'cancelada' && 'Cancelada'}
                    </span>
                  </div>
                </div>

                {/* Lista de Produtos */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Produtos/Serviços</h3>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Produto</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Qtd</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Preço Unit.</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedSale.products.map((product) => (
                          <tr key={product.id} className="hover:bg-gray-50">
                            <td className="px-4 py-2 text-sm">{product.name}</td>
                            <td className="px-4 py-2 text-sm text-right">{product.quantity}</td>
                            <td className="px-4 py-2 text-sm text-right">
                              {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </td>
                            <td className="px-4 py-2 text-sm text-right">
                              {product.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-gray-50 font-medium">
                          <td colSpan={3} className="px-4 py-2 text-sm text-right">Total</td>
                          <td className="px-4 py-2 text-sm text-right">
                            {selectedSale.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Observações */}
                {selectedSale.notes && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Observações</h3>
                    <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{selectedSale.notes}</p>
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

export default Vendas;
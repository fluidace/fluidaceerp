import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { ptBR } from 'date-fns/locale';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import {
  Package, Plus, Filter, Search,
  TrendingUp, AlertTriangle, X, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

interface ChartData {
  name: string;
  value: number;
}

interface MonthlyData {
  name: string;
  entradas: number;
  saidas: number;
}

import { createProduct, getProducts, Product, CreateProductData } from '../lib/products';

const Estoque = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryData, setCategoryData] = useState<ChartData[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    // Calcular dados do gráfico de categorias
    const categories = products.reduce((acc, product) => {
      const existing = acc.find(item => item.name === product.category);
      if (existing) {
        existing.value += product.quantity;
      } else {
        acc.push({ name: product.category, value: product.quantity });
      }
      return acc;
    }, [] as ChartData[]);

    setCategoryData(categories);

    // Dados mensais temporários
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    const mockMonthlyData = months.map(month => ({
      name: month,
      entradas: Math.floor(Math.random() * 500) + 300,
      saidas: Math.floor(Math.random() * 400) + 200
    }));
    setMonthlyData(mockMonthlyData);
  }, [products]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar produtos');
      console.error('Error loading products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProduct = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    
    try {
      setIsLoading(true);
      setError(null);

      const productData: CreateProductData = {
        name: formData.get('name') as string,
        sku: formData.get('sku') as string,
        category: formData.get('category') as string,
        description: formData.get('description') as string,
        quantity: parseInt(formData.get('quantity') as string, 10),
        min_quantity: parseInt(formData.get('min_quantity') as string, 10),
        price: parseFloat(formData.get('price') as string),
        status: 'normal',
        notes: formData.get('notes') as string,
      };

      const newProduct = await createProduct(productData);
      setProducts(prev => [newProduct, ...prev]);
      form.reset();
      
      // Close modal
      const closeButton = form.querySelector('[aria-label="Close"]');
      if (closeButton instanceof HTMLButtonElement) {
        closeButton.click();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar produto');
      console.error('Error creating product:', err);
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
                <Package size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Estoque</h1>
                <p className="text-sm text-gray-500">Gestão de produtos e inventário</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Dialog.Root>
                <Dialog.Trigger asChild>
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    <Plus size={20} />
                    <span className="font-medium">Novo Produto</span>
                  </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                  <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-3xl max-h-[85vh] overflow-y-auto rounded-xl shadow-lg bg-white p-6">
                    <div className="flex justify-between items-center mb-6">
                      <Dialog.Title className="text-lg font-semibold">Novo Produto</Dialog.Title>
                      <Dialog.Close className="p-1 rounded-full hover:bg-gray-100">
                        <X size={20} className="text-gray-500" />
                      </Dialog.Close>
                    </div>
                    
                    <form onSubmit={handleCreateProduct} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Nome do Produto</label>
                          <input
                            type="text"
                            name="name"
                            required
                            className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300"
                            placeholder="Nome do produto"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">SKU</label>
                          <input
                            type="text"
                            name="sku"
                            required
                            className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300"
                            placeholder="SKU do produto"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Categoria</label>
                          <input
                            type="text"
                            name="category"
                            required
                            className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300"
                            placeholder="Categoria do produto"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Quantidade</label>
                          <input
                            type="number"
                            name="quantity"
                            required
                            min="0"
                            className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300"
                            placeholder="Quantidade em estoque"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Quantidade Mínima</label>
                          <input
                            type="number"
                            name="min_quantity"
                            required
                            min="0"
                            className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300"
                            placeholder="Quantidade mínima"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Preço</label>
                          <input
                            type="number"
                            name="price"
                            required
                            min="0"
                            step="0.01"
                            className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300"
                            placeholder="Preço unitário"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Descrição</label>
                        <textarea
                          name="description"
                          rows={3}
                          className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300"
                          placeholder="Descrição do produto"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Observações</label>
                        <textarea
                          name="notes"
                          rows={3}
                          className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300"
                          placeholder="Observações adicionais"
                        />
                      </div>

                      <div className="flex justify-end gap-3">
                        <Dialog.Close className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                          Cancelar
                        </Dialog.Close>
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? 'Salvando...' : 'Salvar Produto'}
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
              value="products"
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'products'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Produtos
            </Tabs.Trigger>
            <Tabs.Trigger
              value="movements"
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'movements'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Movimentações
            </Tabs.Trigger>
          </Tabs.List>

          {/* Conteúdo das Tabs */}
          <Tabs.Content value="overview" className="space-y-6">
            {/* Cards de Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Total em Estoque</span>
                  <span className="p-2 bg-blue-100 rounded-lg">
                    <Package size={20} className="text-blue-600" />
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-2xl font-bold">1.245</span>
                  <span className="text-sm text-gray-500 ml-2">itens</span>
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <ArrowUpRight size={16} className="text-green-500" />
                  <span className="text-green-500 font-medium">12%</span>
                  <span className="text-gray-500 ml-2">vs. mês anterior</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Produtos Baixo Estoque</span>
                  <span className="p-2 bg-amber-100 rounded-lg">
                    <AlertTriangle size={20} className="text-amber-600" />
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-2xl font-bold">8</span>
                  <span className="text-sm text-gray-500 ml-2">produtos</span>
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <ArrowDownRight size={16} className="text-red-500" />
                  <span className="text-red-500 font-medium">3</span>
                  <span className="text-gray-500 ml-2">novos alertas</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Giro de Estoque</span>
                  <span className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp size={20} className="text-green-600" />
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-2xl font-bold">3.2</span>
                  <span className="text-sm text-gray-500 ml-2">média mensal</span>
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <ArrowUpRight size={16} className="text-green-500" />
                  <span className="text-green-500 font-medium">0.5</span>
                  <span className="text-gray-500 ml-2">vs. mês anterior</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Valor Total</span>
                  <span className="p-2 bg-purple-100 rounded-lg">
                    <Package size={20} className="text-purple-600" />
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-2xl font-bold">R$ 324.590</span>
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
                <h3 className="text-lg font-semibold mb-4">Movimentação Mensal</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="name" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip 
                        formatter={(value: number) => `${value} unidades`}
                        labelStyle={{ color: '#111827' }}
                        contentStyle={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.5rem' }}
                      />
                      <Legend />
                      <Bar 
                        dataKey="entradas" 
                        name="Entradas" 
                        fill="#10B981"
                        radius={[4, 4, 0, 0]} 
                      />
                      <Bar 
                        dataKey="saidas" 
                        name="Saídas" 
                        fill="#EF4444"
                        radius={[4, 4, 0, 0]} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-base font-medium mb-4">Distribuição por Categoria</h3>
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#10B981"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {categoryData.map((_, index) => (
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
          </Tabs.Content>

          <Tabs.Content value="products" className="space-y-6">
            {/* Filtros e Busca */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar produtos..."
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

            {/* Lista de Produtos */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                      <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
                      <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Preço Unit.</th>
                      <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {isLoading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                          <div className="flex items-center justify-center gap-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
                            Carregando...
                          </div>
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-red-600">
                          {error}
                        </td>
                      </tr>
                    ) : products.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        Nenhum produto encontrado
                      </td>
                    </tr>
                    ) : (
                      products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <button
                              onClick={() => setSelectedProduct(product)}
                              className="flex items-center group"
                            >
                              <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                <Package size={20} className="text-gray-500" />
                              </div>
                              <div className="ml-4 text-left">
                                <div className="text-sm font-medium text-blue-600 group-hover:text-blue-800 group-hover:underline">
                                  {product.name}
                                </div>
                                <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                              </div>
                            </button>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">{product.category}</td>
                          <td className="px-6 py-4 text-right text-sm text-gray-500">{product.quantity}</td>
                          <td className="px-6 py-4 text-right text-sm text-gray-500">
                            {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </td>
                          <td className="px-6 py-4 text-right text-sm text-gray-500">
                            {(product.price * product.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </td>
                          <td className="px-6 py-4 text-sm text-center">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                              ${product.status === 'normal' ? 'bg-green-100 text-green-800' : ''}
                              ${product.status === 'low' ? 'bg-yellow-100 text-yellow-800' : ''}
                              ${product.status === 'critical' ? 'bg-red-100 text-red-800' : ''}`}
                            >
                              {product.status === 'normal' && 'Normal'}
                              {product.status === 'low' && 'Baixo'}
                              {product.status === 'critical' && 'Crítico'}
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

          <Tabs.Content value="movements" className="space-y-6">
            {/* Lista de Movimentações */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                      <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Responsável</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Motivo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {/* Exemplo de linha */}
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-500">14/03/2024</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Entrada
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">Notebook Dell Inspiron</td>
                      <td className="px-6 py-4 text-right text-sm text-gray-500">10</td>
                      <td className="px-6 py-4 text-sm text-gray-500">João Silva</td>
                      <td className="px-6 py-4 text-sm text-gray-500">Compra de fornecedor</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </main>

      {/* Modal de Detalhes do Produto */}
      <Dialog.Root open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40" />
          <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[800px] translate-x-[-50%] translate-y-[-50%] rounded-xl bg-white p-6 shadow-lg focus:outline-none overflow-y-auto">
            <div className="space-y-6">
              {/* Cabeçalho */}
              <div className="flex items-start justify-between">
                <div>
                  <Dialog.Title className="text-xl font-semibold text-gray-900">
                    Detalhes do Produto
                  </Dialog.Title>
                  <Dialog.Description className="mt-1 text-sm text-gray-500">
                    Informações completas do produto
                  </Dialog.Description>
                </div>
                <Dialog.Close className="text-gray-400 hover:text-gray-500">
                  <X size={20} />
                </Dialog.Close>
              </div>

              {/* Informações do Produto */}
              {selectedProduct && (
                <>
                  {/* Informações Básicas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Nome do Produto</h4>
                      <p className="text-sm">{selectedProduct.name}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">SKU</h4>
                      <p className="text-sm">{selectedProduct.sku}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Categoria</h4>
                      <p className="text-sm">{selectedProduct.category}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Status</h4>
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${selectedProduct.status === 'normal' ? 'bg-green-100 text-green-800' : ''}
                        ${selectedProduct.status === 'low' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${selectedProduct.status === 'critical' ? 'bg-red-100 text-red-800' : ''}`}
                      >
                        {selectedProduct.status === 'normal' && 'Normal'}
                        {selectedProduct.status === 'low' && 'Baixo'}
                        {selectedProduct.status === 'critical' && 'Crítico'}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Quantidade em Estoque</h4>
                      <p className="text-sm">{selectedProduct.quantity}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Quantidade Mínima</h4>
                      <p className="text-sm">{selectedProduct.min_quantity}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Preço Unitário</h4>
                      <p className="text-sm">
                        {selectedProduct.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Valor Total em Estoque</h4>
                      <p className="text-sm">
                        {(selectedProduct.price * selectedProduct.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </p>
                    </div>
                  </div>

                  {/* Descrição */}
                  {selectedProduct.description && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Descrição</h4>
                      <p className="text-sm mt-1">{selectedProduct.description}</p>
                    </div>
                  )}

                  {/* Observações */}
                  {selectedProduct.notes && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Observações</h4>
                      <p className="text-sm mt-1">{selectedProduct.notes}</p>
                    </div>
                  )}

                  {/* Data de Criação/Atualização */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Data de Criação</h4>
                      <p className="text-sm">
                        {format(new Date(selectedProduct.created_at), 'dd/MM/yyyy HH:mm')}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Última Atualização</h4>
                      <p className="text-sm">
                        {format(new Date(selectedProduct.updated_at), 'dd/MM/yyyy HH:mm')}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default Estoque;
import React, { useState } from 'react';
import { Settings, Users, Link, Bell, Lock, Database, Wrench, Moon, Sun, Upload, Globe2, DollarSign, Package, Palette, UserPlus, Key, History, Webhook, Mail, MessageSquare, Shield, Download, Upload as UploadIcon, RefreshCw, Languages, Notebook as Robot, Plus, Trash2, Edit } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';

const users = [
  {
    id: 1,
    name: 'João Silva',
    email: 'joao@empresa.com',
    role: 'Administrador',
    lastAccess: '2024-03-20 14:30',
    status: 'Ativo',
  },
  {
    id: 2,
    name: 'Maria Santos',
    email: 'maria@empresa.com',
    role: 'Financeiro',
    lastAccess: '2024-03-20 10:15',
    status: 'Ativo',
  },
  {
    id: 3,
    name: 'Pedro Costa',
    email: 'pedro@empresa.com',
    role: 'Vendas',
    lastAccess: '2024-03-19 16:45',
    status: 'Inativo',
  },
];

const integrations = [
  {
    id: 1,
    name: 'SEFAZ',
    type: 'Notas Fiscais',
    status: 'Conectado',
    lastSync: '2024-03-20 15:00',
  },
  {
    id: 2,
    name: 'Stripe',
    type: 'Pagamentos',
    status: 'Conectado',
    lastSync: '2024-03-20 14:55',
  },
  {
    id: 3,
    name: 'SendGrid',
    type: 'E-mails',
    status: 'Desconectado',
    lastSync: '2024-03-19 10:30',
  },
];

const activityLogs = [
  {
    id: 1,
    user: 'João Silva',
    action: 'Login no sistema',
    date: '2024-03-20 14:30',
    ip: '192.168.1.100',
  },
  {
    id: 2,
    user: 'Maria Santos',
    action: 'Alteração de configurações',
    date: '2024-03-20 13:15',
    ip: '192.168.1.101',
  },
  {
    id: 3,
    user: 'Sistema',
    action: 'Backup automático',
    date: '2024-03-20 12:00',
    ip: 'Sistema',
  },
];

const Configuracoes = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeTab, setActiveTab] = useState('geral');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Configurações do Sistema</h1>
            <p className="text-gray-500 mt-1">Personalize seu ERP</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
              <Download size={20} /> Exportar Configurações
            </button>
          </div>
        </div>

        {/* Tabs and Content */}
        <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
          <div className="flex gap-6">
            <div className="w-64">
              <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-4`}>
                <Tabs.List className="flex flex-col space-y-2">
                  <Tabs.Trigger
                    value="geral"
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg text-left ${
                      activeTab === 'geral'
                        ? 'bg-blue-50 text-blue-600'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <Settings size={20} />
                    Geral
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="usuarios"
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg text-left ${
                      activeTab === 'usuarios'
                        ? 'bg-blue-50 text-blue-600'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <Users size={20} />
                    Usuários
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="integracoes"
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg text-left ${
                      activeTab === 'integracoes'
                        ? 'bg-blue-50 text-blue-600'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <Link size={20} />
                    Integrações
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="notificacoes"
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg text-left ${
                      activeTab === 'notificacoes'
                        ? 'bg-blue-50 text-blue-600'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <Bell size={20} />
                    Notificações
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="seguranca"
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg text-left ${
                      activeTab === 'seguranca'
                        ? 'bg-blue-50 text-blue-600'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <Lock size={20} />
                    Segurança
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="backup"
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg text-left ${
                      activeTab === 'backup'
                        ? 'bg-blue-50 text-blue-600'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <Database size={20} />
                    Backup
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="avancado"
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg text-left ${
                      activeTab === 'avancado'
                        ? 'bg-blue-50 text-blue-600'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <Wrench size={20} />
                    Avançado
                  </Tabs.Trigger>
                </Tabs.List>
              </div>
            </div>

            <div className="flex-1">
              <Tabs.Content value="geral">
                <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                  <h2 className="text-xl font-semibold mb-6">Configurações Gerais</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Informações da Empresa</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Nome da Empresa</label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg"
                            placeholder="Nome da empresa"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">CNPJ</label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg"
                            placeholder="00.000.000/0000-00"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Logotipo</label>
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Upload size={24} className="text-gray-400" />
                            </div>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                              Alterar Logo
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Localização e Moeda</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Fuso Horário</label>
                          <select className="w-full px-3 py-2 border rounded-lg">
                            <option>America/Sao_Paulo</option>
                            <option>America/New_York</option>
                            <option>Europe/London</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Moeda</label>
                          <select className="w-full px-3 py-2 border rounded-lg">
                            <option>BRL (R$)</option>
                            <option>USD ($)</option>
                            <option>EUR (€)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Formato de Data</label>
                          <select className="w-full px-3 py-2 border rounded-lg">
                            <option>DD/MM/YYYY</option>
                            <option>MM/DD/YYYY</option>
                            <option>YYYY-MM-DD</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Personalização</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Tema</label>
                          <select className="w-full px-3 py-2 border rounded-lg">
                            <option>Claro</option>
                            <option>Escuro</option>
                            <option>Sistema</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Cor Principal</label>
                          <input
                            type="color"
                            className="w-full h-10 px-1 py-1 border rounded-lg"
                            value="#2563eb"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Tabs.Content>

              <Tabs.Content value="usuarios">
                <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Usuários e Permissões</h2>
                    <Dialog.Root>
                      <Dialog.Trigger asChild>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                          <UserPlus size={20} /> Novo Usuário
                        </button>
                      </Dialog.Trigger>
                      <Dialog.Portal>
                        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                        <Dialog.Content className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 w-full max-w-2xl`}>
                          <Dialog.Title className="text-xl font-bold mb-4">Adicionar Novo Usuário</Dialog.Title>
                          <form className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-1">Nome</label>
                                <input
                                  type="text"
                                  className="w-full px-3 py-2 border rounded-lg"
                                  placeholder="Nome completo"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">E-mail</label>
                                <input
                                  type="email"
                                  className="w-full px-3 py-2 border rounded-lg"
                                  placeholder="email@exemplo.com"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">Cargo</label>
                                <input
                                  type="text"
                                  className="w-full px-3 py-2 border rounded-lg"
                                  placeholder="Cargo"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">Função</label>
                                <select className="w-full px-3 py-2 border rounded-lg">
                                  <option>Administrador</option>
                                  <option>Financeiro</option>
                                  <option>Vendas</option>
                                  <option>Estoque</option>
                                </select>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Permissões</label>
                              <div className="space-y-2">
                                <label className="flex items-center gap-2">
                                  <input type="checkbox" className="rounded" />
                                  <span>Acesso total ao sistema</span>
                                </label>
                                <label className="flex items-center gap-2">
                                  <input type="checkbox" className="rounded" />
                                  <span>Gerenciar usuários</span>
                                </label>
                                <label className="flex items-center gap-2">
                                  <input type="checkbox" className="rounded" />
                                  <span>Emitir relatórios</span>
                                </label>
                                <label className="flex items-center gap-2">
                                  <input type="checkbox" className="rounded" />
                                  <span>Configurar sistema</span>
                                </label>
                              </div>
                            </div>
                          </form>
                          <div className="mt-6 flex justify-end gap-4">
                            <Dialog.Close asChild>
                              <button className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors">
                                Cancelar
                              </button>
                            </Dialog.Close>
                            <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                              Adicionar Usuário
                            </button>
                          </div>
                        </Dialog.Content>
                      </Dialog.Portal>
                    </Dialog.Root>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3">Usuário</th>
                          <th className="text-left py-3">E-mail</th>
                          <th className="text-left py-3">Função</th>
                          <th className="text-left py-3">Último Acesso</th>
                          <th className="text-left py-3">Status</th>
                          <th className="text-left py-3">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-b">
                            <td className="py-3">{user.name}</td>
                            <td className="py-3">{user.email}</td>
                            <td className="py-3">{user.role}</td>
                            <td className="py-3">{user.lastAccess}</td>
                            <td className="py-3">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  user.status === 'Ativo'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {user.status}
                              </span>
                            </td>
                            <td className="py-3">
                              <div className="flex gap-2">
                                <button className="text-blue-600 hover:text-blue-800">
                                  <Edit size={18} />
                                </button>
                                <button className="text-red-600 hover:text-red-800">
                                  <Trash2 size={18} />
                                </button>
                                <button className="text-yellow-600 hover:text-yellow-800">
                                  <Key size={18} />
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

              <Tabs.Content value="integracoes">
                <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                  <h2 className="text-xl font-semibold mb-6">Integrações</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {integrations.map((integration) => (
                      <div
                        key={integration.id}
                        className={`${
                          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                        } p-4 rounded-lg`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{integration.name}</h4>
                            <p className="text-sm text-gray-500">{integration.type}</p>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              integration.status === 'Conectado'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {integration.status}
                          </span>
                        </div>
                        <div className="mt-4">
                          <p className="text-sm text-gray-500">
                            Última sincronização: {integration.lastSync}
                          </p>
                        </div>
                        <div className="mt-4">
                          <button className={`w-full px-4 py-2 rounded-lg ${
                            integration.status === 'Conectado'
                              ? 'bg-red-600 text-white hover:bg-red-700'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          } transition-colors`}>
                            {integration.status === 'Conectado' ? 'Desconectar' : 'Conectar'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Tabs.Content>

              <Tabs.Content value="notificacoes">
                <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                  <h2 className="text-xl font-semibold mb-6">Configurações de Notificações</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Notificações por E-mail</h3>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between">
                          <span>Pedidos novos</span>
                          <input type="checkbox" className="rounded" defaultChecked />
                        </label>
                        <label className="flex items-center justify-between">
                          <span>Estoque baixo</span>
                          <input type="checkbox" className="rounded" defaultChecked />
                        </label>
                        <label className="flex items-center justify-between">
                          <span>Faturas vencendo</span>
                          <input type="checkbox" className="rounded" defaultChecked />
                        </label>
                        <label className="flex items-center justify-between">
                          <span>Notas fiscais rejeitadas</span>
                          <input type="checkbox" className="rounded" defaultChecked />
                        </label>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Notificações no Sistema</h3>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between">
                          <span>Alertas em tempo real</span>
                          <input type="checkbox" className="rounded" defaultChecked />
                        </label>
                        <label className="flex items-center justify-between">
                          <span>Sons de notificação</span>
                          <input type="checkbox" className="rounded" />
                        </label>
                        <label className="flex items-center justify-between">
                          <span>Notificações desktop</span>
                          <input type="checkbox" className="rounded" defaultChecked />
                        </label>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Relatórios Automáticos</h3>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between">
                          <span>Relatório diário de vendas</span>
                          <input type="checkbox" className="rounded" />
                        </label>
                        <label className="flex items-center justify-between">
                          <span>Relatório semanal financeiro</span>
                          <input type="checkbox" className="rounded" defaultChecked />
                        </label>
                        <label className="flex items-center justify-between">
                          <span>Relatório mensal de estoque</span>
                          <input type="checkbox" className="rounded" defaultChecked />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </Tabs.Content>

              <Tabs.Content value="seguranca">
                <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                  <h2 className="text-xl font-semibold mb-6">Configurações de Segurança</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Autenticação</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="flex items-center justify-between">
                            <span>Autenticação em dois fatores (2FA)</span>
                            <input type="checkbox" className="rounded" />
                          </label>
                          <p className="text-sm text-gray-500 mt-1">
                            Adicione uma camada extra de segurança à sua conta
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Tempo de expiração da sessão</label>
                          <select className="w-full px-3 py-2 border rounded-lg">
                            <option>30 minutos</option>
                            <option>1 hora</option>
                            <option>4 horas</option>
                            <option>8 horas</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Dispositivos Conectados</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">Chrome - Windows</p>
                            <p className="text-sm text-gray-500">Último acesso: Hoje às 14:30</p>
                          </div>
                          <button className="text-red-600 hover:text-red-800">
                            Desconectar
                          </button>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">Safari - iPhone</p>
                            <p className="text-sm text-gray-500">Último acesso: Ontem às 18:45</p>
                          </div>
                          <button className="text-red-600 hover:text-red-800">
                            Desconectar
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Logs de Atividade</h3>
                      <div className="space-y-3">
                        {activityLogs.map((log) => (
                          <div key={log.id} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                            <History size={20} className="text-gray-400 mt-1" />
                            <div>
                              <p className="font-medium">{log.action}</p>
                              <p className="text-sm text-gray-500">
                                {log.user} - {log.date} - IP: {log.ip}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Tabs.Content>

              <Tabs.Content value="backup">
                <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                  <h2 className="text-xl font-semibold mb-6">Backup e Restauração</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Backup Automático</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Frequência</label>
                          <select className="w-full px-3 py-2 border rounded-lg">
                            <option>Diário</option>
                            <option>Semanal</option>
                            <option>Mensal</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Horário</label>
                          <input
                            type="time"
                            className="w-full px-3 py-2 border rounded-lg"
                            defaultValue="00:00"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Retenção</label>
                          <select className="w-full px-3 py-2 border rounded-lg">
                            <option>7 dias</option>
                            <option>30 dias</option>
                            <option>90 dias</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Backup Manual</h3>
                      <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                          <Download size={20} /> Fazer Backup Agora
                        </button>
                        <button className="flex items-center gap-2 px-4 py 2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                          <UploadIcon size={20} /> Restaurar Backup
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Histórico de Backups</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">Backup Completo</p>
                            <p className="text-sm text-gray-500">20/03/2024 00:00 - 2.5GB</p>
                          </div>
                          <div className="flex gap-2">
                            <button className="text-blue-600 hover:text-blue-800">
                              <Download size={18} />
                            </button>
                            <button className="text-red-600 hover:text-red-800">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">Backup Completo</p>
                            <p className="text-sm text-gray-500">19/03/2024 00:00 - 2.4GB</p>
                          </div>
                          <div className="flex gap-2">
                            <button className="text-blue-600 hover:text-blue-800">
                              <Download size={18} />
                            </button>
                            <button className="text-red-600 hover:text-red-800">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Tabs.Content>

              <Tabs.Content value="avancado">
                <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                  <h2 className="text-xl font-semibold mb-6">Configurações Avançadas</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Personalização de Relatórios</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Layout Padrão</label>
                          <select className="w-full px-3 py-2 border rounded-lg">
                            <option>Detalhado</option>
                            <option>Resumido</option>
                            <option>Personalizado</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Elementos Gráficos</label>
                          <div className="space-y-2">
                            <label className="flex items-center gap-2">
                              <input type="checkbox" className="rounded" defaultChecked />
                              <span>Gráficos de barras</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input type="checkbox" className="rounded" defaultChecked />
                              <span>Gráficos de linha</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input type="checkbox" className="rounded" defaultChecked />
                              <span>Gráficos de pizza</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Automação de Tarefas</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">Envio automático de relatórios</p>
                            <p className="text-sm text-gray-500">Toda segunda-feira às 08:00</p>
                          </div>
                          <button className="text-red-600 hover:text-red-800">
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                          <Plus size={20} /> Nova Automação
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Recursos Beta</h3>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between">
                          <div>
                            <span className="font-medium">Novo painel de análise</span>
                            <p className="text-sm text-gray-500">Versão beta 1.0</p>
                          </div>
                          <input type="checkbox" className="rounded" />
                        </label>
                        <label className="flex items-center justify-between">
                          <div>
                            <span className="font-medium">Assistente virtual</span>
                            <p className="text-sm text-gray-500">Versão beta 0.8</p>
                          </div>
                          <input type="checkbox" className="rounded" />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </Tabs.Content>
            </div>
          </div>
        </Tabs.Root>
      </div>
    </div>
  );
};

export default Configuracoes;
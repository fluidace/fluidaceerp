import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as Tabs from '@radix-ui/react-tabs';
import {
  User, Mail, Phone, MapPin, Lock, Shield, Smartphone,
  Globe, Bell, Download, Trash2, LogOut, Loader2, CheckCircle,
  AlertCircle, Camera, Key
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface ProfileForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
}

interface SecurityForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false
  });

  const { register: registerProfile, handleSubmit: handleSubmitProfile, formState: { errors: errorsProfile } } = useForm<ProfileForm>();
  const { register: registerSecurity, handleSubmit: handleSubmitSecurity, formState: { errors: errorsSecurity }, watch } = useForm<SecurityForm>();

  useEffect(() => {
    loadUserProfile();
    loadSessions();
  }, []);

  const loadUserProfile = async () => {
    try {
      if (!user) return;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (profile) {
        // Update form with profile data
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const loadSessions = async () => {
    try {
      // In a real app, you would fetch active sessions from your backend
      setSessions([
        {
          id: 1,
          device: 'Chrome on Windows',
          location: 'São Paulo, Brazil',
          lastActive: '2024-03-20 14:30',
          current: true
        },
        {
          id: 2,
          device: 'Safari on iPhone',
          location: 'Rio de Janeiro, Brazil',
          lastActive: '2024-03-19 10:15',
          current: false
        }
      ]);
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const onUpdateProfile = async (data: ProfileForm) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      // Update profile logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      setSuccess('Perfil atualizado com sucesso!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const onUpdateSecurity = async (data: SecurityForm) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      if (data.newPassword !== data.confirmPassword) {
        throw new Error('As senhas não coincidem');
      }

      // Update password logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      setSuccess('Senha atualizada com sucesso!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar senha');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsLoading(true);
      setError(null);

      // Upload avatar logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate upload

      setAvatarUrl(URL.createObjectURL(file));
      setSuccess('Foto atualizada com sucesso!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar foto');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Perfil do Usuário</h1>
        <p className="text-gray-500">Gerencie suas informações pessoais e preferências</p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <span>{success}</span>
        </div>
      )}

      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List className="flex space-x-1 border-b border-gray-200 mb-6">
          <Tabs.Trigger
            value="personal"
            className={`px-4 py-2 -mb-px text-sm font-medium ${
              activeTab === 'personal'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Informações Pessoais
          </Tabs.Trigger>
          <Tabs.Trigger
            value="security"
            className={`px-4 py-2 -mb-px text-sm font-medium ${
              activeTab === 'security'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Segurança
          </Tabs.Trigger>
          <Tabs.Trigger
            value="sessions"
            className={`px-4 py-2 -mb-px text-sm font-medium ${
              activeTab === 'sessions'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Sessões
          </Tabs.Trigger>
          <Tabs.Trigger
            value="preferences"
            className={`px-4 py-2 -mb-px text-sm font-medium ${
              activeTab === 'preferences'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Preferências
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="personal" className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center space-x-6 mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full cursor-pointer hover:bg-blue-700"
                >
                  <Camera className="w-4 h-4" />
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
              <div>
                <h3 className="text-lg font-medium">{user?.email}</h3>
                <p className="text-gray-500">Membro desde {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <form onSubmit={handleSubmitProfile(onUpdateProfile)} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nome completo
                </label>
                <div className="mt-1 relative">
                  <input
                    type="text"
                    id="name"
                    className={`block w-full px-3 py-2 border rounded-lg shadow-sm ${
                      errorsProfile.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    {...registerProfile('name', { required: 'Nome é obrigatório' })}
                  />
                  <User className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                {errorsProfile.name && (
                  <p className="mt-1 text-sm text-red-600">{errorsProfile.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Telefone
                </label>
                <div className="mt-1 relative">
                  <input
                    type="tel"
                    id="phone"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm"
                    {...registerProfile('phone')}
                  />
                  <Phone className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Endereço
                </label>
                <div className="mt-1 relative">
                  <input
                    type="text"
                    id="address"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm"
                    {...registerProfile('address')}
                  />
                  <MapPin className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                  Biografia
                </label>
                <div className="mt-1">
                  <textarea
                    id="bio"
                    rows={3}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm"
                    {...registerProfile('bio')}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Salvar alterações</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </Tabs.Content>

        <Tabs.Content value="security" className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Alterar Senha</h3>
            <form onSubmit={handleSubmitSecurity(onUpdateSecurity)} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                  Senha atual
                </label>
                <div className="mt-1 relative">
                  <input
                    type="password"
                    id="currentPassword"
                    className={`block w-full px-3 py-2 border rounded-lg shadow-sm ${
                      errorsSecurity.currentPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                    {...registerSecurity('currentPassword', { required: 'Senha atual é obrigatória' })}
                  />
                  <Lock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                {errorsSecurity.currentPassword && (
                  <p className="mt-1 text-sm text-red-600">{errorsSecurity.currentPassword.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  Nova senha
                </label>
                <div className="mt-1 relative">
                  <input
                    type="password"
                    id="newPassword"
                    className={`block w-full px-3 py-2 border rounded-lg shadow-sm ${
                      errorsSecurity.newPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                    {...registerSecurity('newPassword', {
                      required: 'Nova senha é obrigatória',
                      minLength: {
                        value: 8,
                        message: 'A senha deve ter no mínimo 8 caracteres'
                      }
                    })}
                  />
                  <Key className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                {errorsSecurity.newPassword && (
                  <p className="mt-1 text-sm text-red-600">{errorsSecurity.newPassword.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirme a nova senha
                </label>
                <div className="mt-1 relative">
                  <input
                    type="password"
                    id="confirmPassword"
                    className={`block w-full px-3 py-2 border rounded-lg shadow-sm ${
                      errorsSecurity.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                    {...registerSecurity('confirmPassword', {
                      validate: value => value === watch('newPassword') || 'As senhas não coincidem'
                    })}
                  />
                  <Shield className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                {errorsSecurity.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errorsSecurity.confirmPassword.message}</p>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      <span>Atualizar senha</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium mb-4">Autenticação em Dois Fatores (2FA)</h3>
              <p className="text-gray-500 mb-4">
                Adicione uma camada extra de segurança à sua conta ativando a autenticação em dois fatores.
              </p>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Ativar 2FA</span>
              </button>
            </div>
          </div>
        </Tabs.Content>

        <Tabs.Content value="sessions" className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Sessões Ativas</h3>
            <div className="space-y-4">
              {sessions.map(session => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <Smartphone className="w-8 h-8 text-gray-400" />
                    <div>
                      <p className="font-medium">{session.device}</p>
                      <p className="text-sm text-gray-500">
                        {session.location} • Último acesso: {session.lastActive}
                      </p>
                    </div>
                  </div>
                  {session.current ? (
                    <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
                      Sessão atual
                    </span>
                  ) : (
                    <button className="text-red-600 hover:text-red-700">
                      <LogOut className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button className="mt-4 px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 flex items-center space-x-2">
              <LogOut className="w-5 h-5" />
              <span>Encerrar todas as outras sessões</span>
            </button>
          </div>
        </Tabs.Content>

        <Tabs.Content value="preferences" className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Tema</h3>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setTheme('light')}
                    className={`px-4 py-2 rounded-lg border ${
                      theme === 'light'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 text-gray-700'
                    }`}
                  >
                    Claro
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`px-4 py-2 rounded-lg border ${
                      theme === 'dark'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 text-gray-700'
                    }`}
                  >
                    Escuro
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Idioma</h3>
                <select className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm">
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Notificações</h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={notifications.email}
                      onChange={e => setNotifications({ ...notifications, email: e.target.checked })}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <span>Notificações por e-mail</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={notifications.push}
                      onChange={e => setNotifications({ ...notifications, push: e.target.checked })}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <span>Notificações push</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={notifications.sms}
                      onChange={e => setNotifications({ ...notifications, sms: e.target.checked })}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <span>Notificações por SMS</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-red-600 mb-4">Zona de Perigo</h3>
              <div className="space-y-4">
                <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center space-x-2">
                  <Download className="w-5 h-5" />
                  <span>Exportar meus dados</span>
                </button>
                <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center space-x-2">
                  <Trash2 className="w-5 h-5" />
                  <span>Excluir minha conta</span>
                </button>
              </div>
            </div>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
};

export default Profile;
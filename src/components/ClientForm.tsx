import React, { useState } from 'react';
import { Client, CreateClientInput } from '../lib/clients';
import * as Dialog from '@radix-ui/react-dialog';

interface ClientFormProps {
  initialData?: Client;
  onSubmit: (formData: any) => Promise<boolean>;
  onCancel: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateClientInput>({
    name: initialData?.name || '',
    document: initialData?.document || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    address: initialData?.address || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    postalCode: initialData?.postal_code || '',
    type: initialData?.type || 'PF',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    try {
      const success = await onSubmit(data);
      if (success) {
        form.reset();
        const closeButton = form.querySelector('[aria-label="Close"]');
        if (closeButton instanceof HTMLButtonElement) {
          closeButton.click();
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar cliente');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 p-4 rounded-lg text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nome/Razão Social</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300"
            placeholder="Nome completo"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">E-mail</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300"
            placeholder="email@exemplo.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Documento (CPF/CNPJ)</label>
          <input
            type="text"
            name="document"
            value={formData.document}
            onChange={handleChange}
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
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300"
            placeholder="(00) 00000-0000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tipo</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300"
          >
            <option value="">Selecione...</option>
            <option value="PF">Pessoa Física</option>
            <option value="PJ">Pessoa Jurídica</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            name="status"
            required
            className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300"
          >
            <option value="">Selecione...</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
            <option value="vip">VIP</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Endereço</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
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
          placeholder="Observações sobre o cliente"
        />
      </div>

      <div className="flex justify-end gap-4">
        <Dialog.Close asChild>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
        </Dialog.Close>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Salvando...' : initialData ? 'Atualizar' : 'Criar'}
        </button>
      </div>
    </form>
  );
};

export default ClientForm;

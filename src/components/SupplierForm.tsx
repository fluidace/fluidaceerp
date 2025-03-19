import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { createSupplier } from '../lib/suppliers';
import type { Supplier } from '../lib/suppliers';

export function SupplierForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    
    try {
      const form = event.currentTarget;
      const formData = new FormData(form);
      
      const supplierData: Omit<Supplier, 'id' | 'created_at'> = {
        nome: formData.get('nome') as string,
        cnpj: formData.get('cnpj') as string,
        telefone: formData.get('telefone') as string,
        email: formData.get('email') as string,
        contato: formData.get('contato') as string,
        endereco: formData.get('endereco') as string,
        categorias: formData.getAll('categorias') as string[],
        observacoes: formData.get('observacoes') as string
      };

      await createSupplier(supplierData);
      form.reset();
      const closeButton = form.querySelector('[data-close-dialog]');
      if (closeButton instanceof HTMLElement) {
        closeButton.click();
      }
    } catch (error) {
      console.error('Erro ao cadastrar fornecedor:', error);
      alert('Erro ao cadastrar fornecedor. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Nome da Empresa</label>
          <input
            type="text"
            name="nome"
            required
            className="w-full px-3 py-2 border rounded-lg bg-white text-gray-900"
            placeholder="Nome da empresa"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">CNPJ</label>
          <input
            type="text"
            name="cnpj"
            required
            className="w-full px-3 py-2 border rounded-lg bg-white text-gray-900"
            placeholder="00.000.000/0000-00"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Telefone</label>
          <input
            type="text"
            name="telefone"
            required
            className="w-full px-3 py-2 border rounded-lg bg-white text-gray-900"
            placeholder="(00) 00000-0000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            required
            className="w-full px-3 py-2 border rounded-lg bg-white text-gray-900"
            placeholder="email@empresa.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Pessoa de Contato</label>
          <input
            type="text"
            name="contato"
            required
            className="w-full px-3 py-2 border rounded-lg bg-white text-gray-900"
            placeholder="Nome do contato"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Endereço</label>
          <input
            type="text"
            name="endereco"
            required
            className="w-full px-3 py-2 border rounded-lg bg-white text-gray-900"
            placeholder="Endereço completo"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Categorias de Produtos</label>
          <select name="categorias" className="w-full px-3 py-2 border rounded-lg bg-white text-gray-900" multiple required>
            <option value="Eletrônicos">Eletrônicos</option>
            <option value="Móveis">Móveis</option>
            <option value="Acessórios">Acessórios</option>
            <option value="Outros">Outros</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Observações</label>
          <textarea
            name="observacoes"
            className="w-full px-3 py-2 border rounded-lg bg-white text-gray-900"
            rows={3}
            placeholder="Observações adicionais"
          />
        </div>
      </div>
      <div className="flex justify-end gap-4 mt-6">
        <Dialog.Close asChild>
          <button 
            type="button" 
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
            data-close-dialog
          >
            Cancelar
          </button>
        </Dialog.Close>
        <button 
          type="submit" 
          disabled={isLoading}
          className={`px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Cadastrando...' : 'Cadastrar Fornecedor'}
        </button>
      </div>
    </form>
  );
}

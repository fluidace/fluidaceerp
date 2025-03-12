import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Financeiro from '../pages/Financeiro';
import Vendas from '../pages/Vendas';
import Estoque from '../pages/Estoque';
import Clientes from '../pages/Clientes';
import NotasFiscais from '../pages/NotasFiscais';
import Configuracoes from '../pages/Configuracoes';
import Funcionarios from '../pages/Funcionarios';
import Compras from '../pages/Compras';

const MainContent = () => {
  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/financeiro" element={<Financeiro />} />
          <Route path="/vendas" element={<Vendas />} />
          <Route path="/compras" element={<Compras />} />
          <Route path="/estoque" element={<Estoque />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/notas-fiscais" element={<NotasFiscais />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="/funcionarios" element={<Funcionarios />} />
        </Routes>
      </div>
    </main>
  );
};

export default MainContent;
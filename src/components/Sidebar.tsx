import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  Boxes,
  UserCog,
  ShoppingBag
} from 'lucide-react';
import { useLayout } from '../contexts/LayoutContext';

const Sidebar = () => {
  const { sidebarOpen, toggleSidebar } = useLayout();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: DollarSign, label: 'Financeiro', path: '/financeiro' },
    { icon: ShoppingCart, label: 'Vendas', path: '/vendas' },
    { icon: ShoppingBag, label: 'Compras', path: '/compras' },
    { icon: Package, label: 'Estoque', path: '/estoque' },
    { icon: Users, label: 'Clientes', path: '/clientes' },
    { icon: UserCog, label: 'Funcionários', path: '/funcionarios' },
    { icon: FileText, label: 'Notas Fiscais', path: '/notas-fiscais' },
    { icon: Settings, label: 'Configurações', path: '/configuracoes' },
  ];

  return (
    <div
      className={`${
        sidebarOpen ? 'w-64' : 'w-20'
      } bg-gradient-to-b from-blue-700 via-blue-600 to-purple-600 text-white h-screen flex flex-col transition-all duration-300 ease-in-out fixed lg:relative z-30`}
    >
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
           <img src="https://res.cloudinary.com/dyk4ip9py/image/upload/v1741710240/ngmvh9b4yrkv39mehkgr.png" alt="Fluidace Logo" className="h-8 w-8" />
          {sidebarOpen && <h1 className="text-xl font-bold">Fluidace</h1>}
        </div>
        <button
          onClick={toggleSidebar}
          className="text-white hover:text-blue-200 hidden lg:block"
        >
          <ChevronLeft
            className={`h-6 w-6 transform transition-transform duration-300 ${
              !sidebarOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm ${
                isActive
                  ? 'bg-white/10 border-l-4 border-white'
                  : 'hover:bg-white/5'
              } transition-colors duration-200`
            }
          >
            <item.icon className={`h-5 w-5 ${!sidebarOpen ? 'mx-auto' : 'mr-3'}`} />
            {sidebarOpen && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-white/20">
        <button className="flex items-center text-sm hover:bg-white/5 w-full px-4 py-2 rounded transition-colors duration-200">
          <LogOut className={`h-5 w-5 ${!sidebarOpen ? 'mx-auto' : 'mr-3'}`} />
          {sidebarOpen && <span>Sair</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LayoutProvider } from './contexts/LayoutContext';
import PrivateRoute from './components/PrivateRoute';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import Profile from './pages/auth/Profile';

// App Pages
import Dashboard from './pages/Dashboard';
import Financeiro from './pages/Financeiro';
import Vendas from './pages/Vendas';
import Estoque from './pages/Estoque';
import Clientes from './pages/Clientes';
import NotasFiscais from './pages/NotasFiscais';
import Configuracoes from './pages/Configuracoes';
import Funcionarios from './pages/Funcionarios';
import Compras from './pages/Compras';

// Layout Components
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-screen bg-gray-50">
    <Sidebar />
    <div className="flex-1 flex flex-col overflow-hidden">
      <TopBar />
      {children}
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <LayoutProvider>
                  <AppLayout>
                    <Dashboard />
                  </AppLayout>
                </LayoutProvider>
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <LayoutProvider>
                  <AppLayout>
                    <Profile />
                  </AppLayout>
                </LayoutProvider>
              </PrivateRoute>
            }
          />
          <Route
            path="/financeiro"
            element={
              <PrivateRoute>
                <LayoutProvider>
                  <AppLayout>
                    <Financeiro />
                  </AppLayout>
                </LayoutProvider>
              </PrivateRoute>
            }
          />
          <Route
            path="/vendas"
            element={
              <PrivateRoute>
                <LayoutProvider>
                  <AppLayout>
                    <Vendas />
                  </AppLayout>
                </LayoutProvider>
              </PrivateRoute>
            }
          />
          <Route
            path="/compras"
            element={
              <PrivateRoute>
                <LayoutProvider>
                  <AppLayout>
                    <Compras />
                  </AppLayout>
                </LayoutProvider>
              </PrivateRoute>
            }
          />
          <Route
            path="/estoque"
            element={
              <PrivateRoute>
                <LayoutProvider>
                  <AppLayout>
                    <Estoque />
                  </AppLayout>
                </LayoutProvider>
              </PrivateRoute>
            }
          />
          <Route
            path="/clientes"
            element={
              <PrivateRoute>
                <LayoutProvider>
                  <AppLayout>
                    <Clientes />
                  </AppLayout>
                </LayoutProvider>
              </PrivateRoute>
            }
          />
          <Route
            path="/notas-fiscais"
            element={
              <PrivateRoute>
                <LayoutProvider>
                  <AppLayout>
                    <NotasFiscais />
                  </AppLayout>
                </LayoutProvider>
              </PrivateRoute>
            }
          />
          <Route
            path="/configuracoes"
            element={
              <PrivateRoute>
                <LayoutProvider>
                  <AppLayout>
                    <Configuracoes />
                  </AppLayout>
                </LayoutProvider>
              </PrivateRoute>
            }
          />
          <Route
            path="/funcionarios"
            element={
              <PrivateRoute>
                <LayoutProvider>
                  <AppLayout>
                    <Funcionarios />
                  </AppLayout>
                </LayoutProvider>
              </PrivateRoute>
            }
          />

          {/* Redirect any unknown routes to dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
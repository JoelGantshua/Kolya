import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DashboardLayout from './Dashboard';
import DashboardHome from './DashboardHome';
import OrdersPage from './OrdersPage';
import ReservationsPage from './ReservationsPage';
import MessagesPage from './ContactMessagesPage';
import UsersPage from './UsersPage';
import Login from '../Login/Login';

const DashboardRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem('isAuthenticated') === 'true';
      setIsAuthenticated(authStatus);
    };

    checkAuth();
    const handleStorageChange = () => checkAuth();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Rediriger vers /login si non authentifié
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="orders/:id" element={<OrderDetailPage />} />
        <Route path="reservations" element={<ReservationsPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};

// Page de détails temporaire
const OrderDetailPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-6">Détails de la commande</h1>
    <div className="bg-white rounded-lg shadow p-6">
      <p>Fonctionnalité à venir - Détails de la commande</p>
    </div>
  </div>
);

export { DashboardRoutes as default };

import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DashboardLayout from './Dashboard';
import DashboardHome from './DashboardHome';
import OrdersPage from './OrdersPage';
import ReservationsPage from './ReservationsPage';
import MessagesPage from './ContactMessagesPage';
import UsersPage from './UsersPage';
import Login from '../Login/Login';
import authService from '../../services/auth';

const DashboardRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(authService.isAuthenticated());
    };

    checkAuth();
    
    // Vérifier périodiquement l'état d'authentification
    const interval = setInterval(checkAuth, 60000); // Toutes les minutes
    
    return () => clearInterval(interval);
  }, []);

  // Afficher un indicateur de chargement pendant la vérification de l'authentification
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Rediriger vers la page de connexion si non authentifié
  if (!isAuthenticated) {
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
const OrderDetailPage = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Détails de la commande</h2>
      <p>Page de détails de la commande</p>
    </div>
  );
};

export { DashboardRoutes as default };

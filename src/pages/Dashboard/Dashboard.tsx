import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiHome, FiShoppingBag, FiCalendar, FiMail, FiUsers, FiLogOut } from 'react-icons/fi';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: <FiHome />, label: 'Tableau de bord', path: '/dashboard' },
    { icon: <FiShoppingBag />, label: 'Commandes', path: '/dashboard/orders' },
    { icon: <FiCalendar />, label: 'Réservations', path: '/dashboard/reservations' },
    { icon: <FiMail />, label: 'Messages', path: '/dashboard/messages' },
    { icon: <FiUsers />, label: 'Utilisateurs', path: '/dashboard/users' },
  ];

  const handleLogout = () => {
    // Gérer la déconnexion
    navigate('/login');
  };

  return (
    <div className={styles.dashboard}>
      {/* Sidebar pour les écrans larges */}
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
        <div className={styles.sidebarHeader}>
          <h2>Tableau de bord</h2>
          <button 
            className={styles.closeBtn} 
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Fermer le menu"
          >
            <FiX />
          </button>
        </div>
        
        <nav className={styles.nav}>
          <ul>
            {menuItems.map((item) => (
              <li key={item.path}>
                <button
                  className={`${styles.navItem} ${location.pathname === item.path ? styles.active : ''}`}
                  onClick={() => {
                    navigate(item.path);
                    setIsSidebarOpen(false);
                  }}
                >
                  <span className={styles.icon}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.footer}>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <FiLogOut />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Contenu principal */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <button 
            className={styles.menuButton}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Ouvrir le menu"
          >
            <FiMenu />
          </button>
          <h1>
            {menuItems.find(item => item.path === location.pathname)?.label || 'Tableau de bord'}
          </h1>
          <div className={styles.userInfo}>
            <span>Admin</span>
            <div className={styles.avatar}>
              <img 
                src="/images/3.jpg" 
                alt="Profil"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/3.jpg';
                }}
              />
            </div>
          </div>
        </header>

        <div className={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

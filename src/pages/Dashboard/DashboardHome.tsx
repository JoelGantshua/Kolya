import { FiDollarSign, FiShoppingBag, FiUsers, FiCalendar, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import styles from './Dashboard.module.css';

// Données factices pour la démo
const stats = [
  {
    title: 'Revenu du jour',
    value: '1,258 €',
    change: 12.5,
    icon: <FiDollarSign size={24} />,
    color: '#3b82f6',
  },
  {
    title: 'Commandes',
    value: '24',
    change: 8.3,
    icon: <FiShoppingBag size={24} />,
    color: '#10b981',
  },
  {
    title: 'Nouveaux clients',
    value: '15',
    change: -2.1,
    icon: <FiUsers size={24} />,
    color: '#8b5cf6',
  },
  {
    title: 'Réservations',
    value: '18',
    change: 5.7,
    icon: <FiCalendar size={24} />,
    color: '#f59e0b',
  },
];

const recentOrders = [
  {
    id: '#ORD-001',
    customer: 'Paty International',
    date: '22/10/2023',
    amount: '45.90 €',
    status: 'completed',
  },
  {
    id: '#ORD-002',
    customer: 'Sab Debi',
    date: '22/10/2023',
    amount: '32.50 €',
    status: 'pending',
  },
  {
    id: '#ORD-003',
    customer: 'GUY',
    date: '21/10/2023',
    amount: '28.75 €',
    status: 'completed',
  },
  {
    id: '#ORD-004',
    customer: 'Moussaka',
    date: '21/10/2023',
    amount: '52.30 €',
    status: 'cancelled',
  },
];

const DashboardHome = () => {
  return (
    <div>
      <div className={styles.dashboardCards}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3>{stat.title}</h3>
                <p>{stat.value}</p>
                <div className={`${styles.trend} ${stat.change >= 0 ? 'up' : 'down'}`}>
                  {stat.change >= 0 ? <FiArrowUp /> : <FiArrowDown />}
                  <span style={{ marginLeft: '4px' }}>{Math.abs(stat.change)}%</span>
                  <span style={{ marginLeft: '4px', color: '#6b7280' }}>vs. hier</span>
                </div>
              </div>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '12px', 
                backgroundColor: `${stat.color}10`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: stat.color,
              }}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.card} style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>Commandes récentes</h2>
          <Link to="/dashboard/orders" className={styles.btn} style={{ textDecoration: 'none' }}>
            Voir tout
          </Link>
        </div>
        
        <div className={styles.tableContainer}>
          <table>
            <thead>
              <tr>
                <th>N° de commande</th>
                <th>Client</th>
                <th>Date</th>
                <th>Montant</th>
                <th>Statut</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.date}</td>
                  <td>{order.amount}</td>
                  <td>
                    <span className={`${styles.status} ${styles[order.status]}`}>
                      {order.status === 'completed' ? 'Terminé' : 
                       order.status === 'pending' ? 'En attente' : 'Annulé'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Link to={`/dashboard/orders/${order.id}`} className={styles.btn} style={{ 
                      padding: '0.375rem 0.75rem',
                      fontSize: '0.875rem',
                      textDecoration: 'none'
                    }}>
                      Détails
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className={styles.card}>
          <h3>Top plats populaires</h3>
          <div style={{ marginTop: '1rem' }}>
            {['Poulet rôti', 'Pâtes carbonara', 'Salade César', 'Tarte aux pommes', 'Glace vanille']
              .map((item, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '0.75rem 0',
                  borderBottom: '1px solid #f3f4f6'
                }}>
                  <span>{index + 1}. {item}</span>
                  <span style={{ color: '#6b7280' }}>{Math.floor(Math.random() * 50) + 10} commandes</span>
                </div>
              ))}
          </div>
        </div>

        <div className={styles.card}>
          <h3>Activité récente</h3>
          <div style={{ marginTop: '1rem' }}>
            {[
              { action: 'Nouvelle commande #ORD-005', time: 'Il y a 5 min' },
              { action: 'Réservation confirmée - Table #4', time: 'Il y a 1h' },
              { action: 'Paiement reçu - 45.90 €', time: 'Il y a 2h' },
              { action: 'Nouveau message de contact', time: 'Il y a 3h' },
              { action: 'Mise à jour du menu', time: 'Il y a 5h' },
            ].map((activity, index) => (
              <div key={index} style={{ 
                padding: '0.75rem 0',
                borderBottom: '1px solid #f3f4f6',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>{activity.action}</span>
                <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;

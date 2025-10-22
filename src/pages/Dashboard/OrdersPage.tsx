import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiFilter, FiChevronLeft, FiChevronRight, FiCalendar, FiDollarSign } from 'react-icons/fi';
import styles from './Dashboard.module.css';

// Types
type OrderStatus = 'all' | 'pending' | 'completed' | 'cancelled' | 'refunded';

interface Order {
  id: string;
  customer: string;
  date: string;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  items: { name: string; quantity: number; price: number }[];
}

// Données factices pour la démo
const generateMockOrders = (count: number): Order[] => {
  const statuses: Order['status'][] = ['pending', 'completed', 'cancelled', 'refunded'];
  const items = [
    { name: 'Poulet rôti', price: 14.90 },
    { name: 'Pâtes carbonara', price: 12.50 },
    { name: 'Salade César', price: 9.90 },
    { name: 'Pizza Margherita', price: 11.50 },
    { name: 'Dessert du jour', price: 6.50 },
  ];
  
  return Array.from({ length: count }, (_, i) => {
    const orderItems = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => {
      const item = items[Math.floor(Math.random() * items.length)];
      return {
        ...item,
        quantity: Math.floor(Math.random() * 3) + 1,
      };
    });
    
    const total = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    return {
      id: `ORD-${1000 + i}`,
      customer: ['Jean Dupont', 'Marie Martin', 'Pierre Durand', 'Sophie Lambert', 'Thomas Bernard'][Math.floor(Math.random() * 5)],
      date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      amount: parseFloat(total.toFixed(2)),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      items: orderItems,
    };
  });
};

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('');
  
  const ordersPerPage = 10;

  // Charger les données
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        // Simuler un appel API
        await new Promise(resolve => setTimeout(resolve, 800));
        const mockOrders = generateMockOrders(45);
        setOrders(mockOrders);
        setFilteredOrders(mockOrders);
      } catch (error) {
        console.error('Erreur lors du chargement des commandes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filtrer les commandes
  useEffect(() => {
    let result = [...orders];
    
    // Filtre par statut
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }
    
    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        order => 
          order.id.toLowerCase().includes(term) || 
          order.customer.toLowerCase().includes(term) ||
          order.items.some(item => item.name.toLowerCase().includes(term))
      );
    }
    
    // Filtre par date
    if (dateFilter) {
      result = result.filter(order => order.date === dateFilter);
    }
    
    setFilteredOrders(result);
    setCurrentPage(1); // Réinitialiser à la première page lors du filtrage
  }, [searchTerm, statusFilter, dateFilter, orders]);

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Formater la date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Calculer le total des commandes
  const totalAmount = filteredOrders.reduce((sum, order) => sum + order.amount, 0);

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1>Commandes</h1>
        <div className={styles.headerActions}>
          <button className={`${styles.btn} ${styles.btnPrimary}`}>
            Exporter
          </button>
        </div>
      </div>

      <div className={styles.card} style={{ marginBottom: '1.5rem' }}>
        <div className={styles.filters}>
          <div className={styles.searchBar}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Rechercher une commande..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          
          <div className={styles.filterGroup}>
            <FiFilter className={styles.filterIcon} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus)}
              className={styles.selectInput}
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="completed">Terminé</option>
              <option value="cancelled">Annulé</option>
              <option value="refunded">Remboursé</option>
            </select>
          </div>
          
          <div className={styles.filterGroup}>
            <FiCalendar className={styles.filterIcon} />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className={styles.dateInput}
            />
          </div>
          
          <button 
            className={styles.btn} 
            onClick={() => {
              setStatusFilter('all');
              setSearchTerm('');
              setDateFilter('');
            }}
            disabled={!searchTerm && statusFilter === 'all' && !dateFilter}
          >
            Réinitialiser
          </button>
        </div>
      </div>

      <div className={styles.card}>
        {isLoading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Chargement des commandes...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Aucune commande trouvée</p>
            <button 
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={() => {
                setStatusFilter('all');
                setSearchTerm('');
                setDateFilter('');
              }}
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <>
            <div className={styles.tableContainer}>
              <table>
                <thead>
                  <tr>
                    <th>N° Commande</th>
                    <th>Client</th>
                    <th>Date</th>
                    <th>Montant</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <Link to={`/dashboard/orders/${order.id}`} className={styles.link}>
                          {order.id}
                        </Link>
                      </td>
                      <td>{order.customer}</td>
                      <td>{formatDate(order.date)}</td>
                      <td>{order.amount.toFixed(2)} €</td>
                      <td>
                        <span className={`${styles.status} ${styles[order.status]}`}>
                          {order.status === 'pending' && 'En attente'}
                          {order.status === 'completed' && 'Terminé'}
                          {order.status === 'cancelled' && 'Annulé'}
                          {order.status === 'refunded' && 'Remboursé'}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <Link 
                            to={`/dashboard/orders/${order.id}`} 
                            className={`${styles.btn} ${styles.btnSm} ${styles.btnPrimary}`}
                          >
                            Voir
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className={styles.pagination}>
              <div className={styles.paginationInfo}>
                Affichage de {indexOfFirstOrder + 1} à {Math.min(indexOfLastOrder, filteredOrders.length)} sur {filteredOrders.length} commandes
              </div>
              
              <div className={styles.paginationControls}>
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`${styles.pageButton} ${currentPage === 1 ? styles.disabled : ''}`}
                >
                  <FiChevronLeft />
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Afficher les numéros de page avec une logique pour gérer beaucoup de pages
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={i}
                      onClick={() => paginate(pageNumber)}
                      className={`${styles.pageButton} ${currentPage === pageNumber ? styles.active : ''}`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`${styles.pageButton} ${currentPage === totalPages ? styles.disabled : ''}`}
                >
                  <FiChevronRight />
                </button>
              </div>
              
              <div className={styles.paginationSummary}>
                <FiDollarSign />
                <span>Total: {(totalAmount).toFixed(2)} €</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;

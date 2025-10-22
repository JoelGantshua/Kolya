import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiCalendar,  
  FiUsers, 
  FiClock, 
  FiSearch, 
  FiFilter, 
  FiChevronLeft, 
  FiChevronRight,
  FiCheckCircle,
  FiXCircle,
  FiClock as FiPending
} from 'react-icons/fi';
import styles from './Dashboard.module.css';

// Types
type ReservationStatus = 'all' | 'confirmed' | 'pending' | 'cancelled' | 'completed';

interface Reservation {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  date: string;
  time: string;
  partySize: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  specialRequests: string;
  tableNumber?: number;
  createdAt: string;
}

// Données factices pour la démo
const generateMockReservations = (count: number): Reservation[] => {
  const statuses: Reservation['status'][] = ['confirmed', 'pending', 'cancelled', 'completed'];
  const times = ['12:00', '12:30', '13:00', '13:30', '19:00', '19:30', '20:00', '20:30', '21:00'];
  const specialRequests = [
    'Table près de la fenêtre',
    'Anniversaire',
    'Allergie aux arachides',
    'Chaises bébé nécessaires',
    'Régime végétarien',
    'Fête de mariage',
    'Table isolée si possible',
    ''
  ];
  
  return Array.from({ length: count }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + Math.floor(Math.random() * 30) - 10); // -10 à +20 jours
    
    return {
      id: `RES-${2000 + i}`,
      customerName: ['Jean Dupont', 'Marie Martin', 'Pierre Durand', 'Sophie Lambert', 'Thomas Bernard'][Math.floor(Math.random() * 5)],
      customerPhone: `06${Math.floor(10000000 + Math.random() * 90000000)}`,
      customerEmail: `client${i}@example.com`,
      date: date.toISOString().split('T')[0],
      time: times[Math.floor(Math.random() * times.length)],
      partySize: Math.floor(Math.random() * 8) + 1,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      specialRequests: Math.random() > 0.3 ? specialRequests[Math.floor(Math.random() * specialRequests.length)] : '',
      tableNumber: Math.random() > 0.2 ? Math.floor(Math.random() * 15) + 1 : undefined,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
    };
  });
};

const ReservationsPage = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReservationStatus>('all');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  
  const reservationsPerPage = 10;

  // Charger les données
  useEffect(() => {
    const fetchReservations = async () => {
      setIsLoading(true);
      try {
        // Simuler un appel API
        await new Promise(resolve => setTimeout(resolve, 800));
        const mockReservations = generateMockReservations(35);
        setReservations(mockReservations);
        setFilteredReservations(mockReservations);
      } catch (error) {
        console.error('Erreur lors du chargement des réservations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservations();
  }, []);

  // Filtrer les réservations
  useEffect(() => {
    let result = [...reservations];
    
    // Filtre par statut
    if (statusFilter !== 'all') {
      result = result.filter(reservation => reservation.status === statusFilter);
    }
    
    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        reservation => 
          reservation.id.toLowerCase().includes(term) || 
          reservation.customerName.toLowerCase().includes(term) ||
          reservation.customerPhone.includes(term) ||
          (reservation.tableNumber && reservation.tableNumber.toString().includes(term))
      );
    }
    
    // Filtre par date
    if (dateFilter) {
      result = result.filter(reservation => reservation.date === dateFilter);
    }
    
    // Trier par date et heure
    result.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });
    
    setFilteredReservations(result);
    setCurrentPage(1); // Réinitialiser à la première page lors du filtrage
  }, [searchTerm, statusFilter, dateFilter, reservations]);

  // Pagination
  const indexOfLastReservation = currentPage * reservationsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - reservationsPerPage;
  const currentReservations = filteredReservations.slice(indexOfFirstReservation, indexOfLastReservation);
  const totalPages = Math.ceil(filteredReservations.length / reservationsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Formater la date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
    });
  };

  // Obtenir le statut de la réservation avec icône
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className={`${styles.status} ${styles.confirmed}`}>
            <FiCheckCircle /> Confirmée
          </span>
        );
      case 'pending':
        return (
          <span className={`${styles.status} ${styles.pending}`}>
            <FiPending /> En attente
          </span>
        );
      case 'cancelled':
        return (
          <span className={`${styles.status} ${styles.cancelled}`}>
            <FiXCircle /> Annulée
          </span>
        );
      case 'completed':
        return (
          <span className={`${styles.status} ${styles.completed}`}>
            <FiCheckCircle /> Terminée
          </span>
        );
      default:
        return status;
    }
  };

  // Obtenir le nombre de réservations par statut
  const getReservationCountByStatus = (status: string) => {
    return reservations.filter((r) => r.status === status).length;
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1>Réservations</h1>
        <div className={styles.headerActions}>
          <button className={`${styles.btn} ${styles.btnPrimary}`}>
            + Nouvelle réservation
          </button>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className={styles.dashboardCards} style={{ marginBottom: '1.5rem' }}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Total</h3>
            <div className={`${styles.cardIcon} ${styles.blue}`}>
              <FiCalendar />
            </div>
          </div>
          <p className={styles.cardValue}>{reservations.length}</p>
          <p className={styles.cardLabel}>Réservations</p>
        </div>
        
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Confirmées</h3>
            <div className={`${styles.cardIcon} ${styles.green}`}>
              <FiCheckCircle />
            </div>
          </div>
          <p className={styles.cardValue}>{getReservationCountByStatus('confirmed')}</p>
          <p className={styles.cardLabel}>Réservations</p>
        </div>
        
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>En attente</h3>
            <div className={`${styles.cardIcon} ${styles.orange}`}>
              <FiPending />
            </div>
          </div>
          <p className={styles.cardValue}>{getReservationCountByStatus('pending')}</p>
          <p className={styles.cardLabel}>En attente</p>
        </div>
        
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Annulées</h3>
            <div className={`${styles.cardIcon} ${styles.red}`}>
              <FiXCircle />
            </div>
          </div>
          <p className={styles.cardValue}>{getReservationCountByStatus('cancelled')}</p>
          <p className={styles.cardLabel}>Annulées</p>
        </div>
      </div>

      <div className={styles.card} style={{ marginBottom: '1.5rem' }}>
        <div className={styles.filters}>
          <div className={styles.searchBar}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Rechercher une réservation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          
          <div className={styles.filterGroup}>
            <FiFilter className={styles.filterIcon} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ReservationStatus)}
              className={styles.selectInput}
            >
              <option value="all">Tous les statuts</option>
              <option value="confirmed">Confirmées</option>
              <option value="pending">En attente</option>
              <option value="cancelled">Annulées</option>
              <option value="completed">Terminées</option>
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
            <p>Chargement des réservations...</p>
          </div>
        ) : filteredReservations.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Aucune réservation trouvée</p>
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
                    <th>ID</th>
                    <th>Client</th>
                    <th>Date & Heure</th>
                    <th>Convives</th>
                    <th>Table</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentReservations.map((reservation) => (
                    <tr key={reservation.id}>
                      <td>
                        <Link to={`/dashboard/reservations/${reservation.id}`} className={styles.link}>
                          {reservation.id}
                        </Link>
                      </td>
                      <td>
                        <div className={styles.customerInfo}>
                          <div className={styles.customerName}>{reservation.customerName}</div>
                          <div className={styles.customerContact}>
                            {reservation.customerPhone}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className={styles.datetimeCell}>
                          <div className={styles.date}>{formatDate(reservation.date)}</div>
                          <div className={styles.time}>
                            <FiClock className={styles.timeIcon} /> {reservation.time}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className={styles.partySize}>
                          <FiUsers className={styles.partyIcon} /> {reservation.partySize} pers.
                        </div>
                      </td>
                      <td>
                        {reservation.tableNumber ? (
                          <span className={styles.tableBadge}>
                            Table {reservation.tableNumber}
                          </span>
                        ) : (
                          <span className={styles.noTable}>À attribuer</span>
                        )}
                      </td>
                      <td>
                        {getStatusBadge(reservation.status)}
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <Link 
                            to={`/dashboard/reservations/${reservation.id}`} 
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
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <div className={styles.paginationInfo}>
                  Affichage de {indexOfFirstReservation + 1} à {Math.min(indexOfLastReservation, filteredReservations.length)} sur {filteredReservations.length} réservations
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
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ReservationsPage;

import { useState, useEffect } from 'react';
import { 
  FiMail, 
  FiSearch, 
  FiFilter, 
  FiChevronLeft, 
  FiChevronRight,
  FiCheck,
  FiTrash2,
  FiClock,
  FiAlertCircle,
  FiMessageSquare,
  FiCalendar,
  FiPhone,
  //FiEye // a utiliser plustar
} from 'react-icons/fi';
import styles from './Dashboard.module.css';

// Types
type MessageStatus = 'all' | 'unread' | 'read' | 'replied' | 'archived';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  date: string;
  read: boolean;
  replied: boolean;
  tags?: string[];
}

// Données factices pour la démo
const generateMockMessages = (count: number): ContactMessage[] => {
  const statuses: ContactMessage['status'][] = ['unread', 'read', 'replied', 'archived'];
  const subjects = [
    'Demande d\'information',
    'Réservation de table',
    'Question sur le menu',
    'Événement privé',
    'Réclamation',
    'Demande de partenariat',
    'Autre demande'
  ];
  
  const messages = [
    'Bonjour, je souhaiterais réserver une table pour 4 personnes ce vendredi soir. Est-ce possible ?',
    'Avez-vous des options végétariennes dans votre menu ?',
    'Je voudrais organiser un anniversaire dans votre restaurant. Quelles sont les possibilités ?',
    'Le service était excellent lors de notre dernière visite. Félicitations à toute l\'équipe !',
    'Pouvez-vous me confirmer ma réservation de ce midi ?',
    'Bonjour, j\'ai oublié mon manteau hier soir. Comment puis-je le récupérer ?',
    'Je souhaiterais prendre un rendez-vous pour discuter d\'un événement d\'entreprise.'
  ];
  
  const tags = [
    'Réservation', 'Menu', 'Événement', 'Réclamation', 'Service client', 'Autre'
  ];
  
  return Array.from({ length: count }, (_, i) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const hasPhone = Math.random() > 0.3;
    const messageTags = [];
    
    // Ajouter 1-3 tags aléatoires
    const numTags = Math.floor(Math.random() * 3) + 1;
    const availableTags = [...tags];
    for (let j = 0; j < numTags && availableTags.length > 0; j++) {
      const randomIndex = Math.floor(Math.random() * availableTags.length);
      messageTags.push(availableTags.splice(randomIndex, 1)[0]);
    }
    
    return {
      id: `MSG-${3000 + i}`,
      name: ['Jean Dupont', 'Marie Martin', 'Pierre Durand', 'Sophie Lambert', 'Thomas Bernard', 'Camille Petit', 'Nicolas Leroy'][Math.floor(Math.random() * 7)],
      email: `client${i}@example.com`,
      phone: hasPhone ? `06${Math.floor(10000000 + Math.random() * 90000000)}` : undefined,
      subject: subjects[Math.floor(Math.random() * subjects.length)],
      message: messages[Math.floor(Math.random() * messages.length)],
      status,
      read: status !== 'unread',
      replied: status === 'replied',
      tags: messageTags,
      date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000 - Math.floor(Math.random() * 24) * 60 * 60 * 1000).toISOString(),
    };
  });
};

const ContactMessagesPage = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<MessageStatus>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  
  const messagesPerPage = 10;

  // Charger les données
  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        // Simuler un appel API
        await new Promise(resolve => setTimeout(resolve, 800));
        const mockMessages = generateMockMessages(42);
        setMessages(mockMessages);
        setFilteredMessages(mockMessages);
      } catch (error) {
        console.error('Erreur lors du chargement des messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, []);

  // Filtrer les messages
  useEffect(() => {
    let result = [...messages];
    
    // Filtre par statut
    if (statusFilter !== 'all') {
      result = result.filter(message => {
        if (statusFilter === 'unread') return !message.read;
        if (statusFilter === 'read') return message.read && !message.replied;
        if (statusFilter === 'replied') return message.replied;
        if (statusFilter === 'archived') return message.status === 'archived';
        return true;
      });
    }
    
    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        message => 
          message.id.toLowerCase().includes(term) || 
          message.name.toLowerCase().includes(term) ||
          message.email.toLowerCase().includes(term) ||
          message.subject.toLowerCase().includes(term) ||
          (message.phone && message.phone.includes(term)) ||
          message.message.toLowerCase().includes(term)
      );
    }
    
    // Trier par date (du plus récent au plus ancien)
    result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setFilteredMessages(result);
    setCurrentPage(1); // Réinitialiser à la première page lors du filtrage
  }, [searchTerm, statusFilter, messages]);

  // Pagination
  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = filteredMessages.slice(indexOfFirstMessage, indexOfLastMessage);
  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Aujourd\'hui, ' + date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays === 1) {
      return 'Hier, ' + date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays < 7) {
      return date.toLocaleDateString('fr-FR', { weekday: 'long', hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
  };

  // Marquer un message comme lu
  const markAsRead = (id: string) => {
    setMessages(prevMessages =>
      prevMessages.map(msg =>
        msg.id === id ? { ...msg, read: true, status: 'read' as const } : msg
      )
    );
  };

  // Marquer un message comme répondu
  const markAsReplied = (id: string) => {
    setMessages(prevMessages =>
      prevMessages.map(msg =>
        msg.id === id ? { ...msg, replied: true, status: 'replied' as const } : msg
      )
    );
  };

  // Archiver un message
  const archiveMessage = (id: string) => {
    setMessages(prevMessages =>
      prevMessages.map(msg =>
        msg.id === id ? { ...msg, status: 'archived' as const } : msg
      )
    );
  };

  // Supprimer un message
  const deleteMessage = (id: string) => {
    setMessages(prevMessages => prevMessages.filter(msg => msg.id !== id));
    setSelectedMessages(prev => prev.filter(msgId => msgId !== id));
    if (selectedMessage?.id === id) {
      setSelectedMessage(null);
    }
  };

  // Sélectionner/désélectionner un message
  const toggleSelectMessage = (id: string) => {
    setSelectedMessages(prev =>
      prev.includes(id) ? prev.filter(msgId => msgId !== id) : [...prev, id]
    );
  };

  // Sélectionner/désélectionner tous les messages visibles
  const toggleSelectAll = () => {
    if (selectedMessages.length === currentMessages.length) {
      setSelectedMessages([]);
    } else {
      setSelectedMessages(currentMessages.map(msg => msg.id));
    }
  };

  // Actions groupées
  const markSelectedAsRead = () => {
    setMessages(prevMessages =>
      prevMessages.map(msg =>
        selectedMessages.includes(msg.id) ? { ...msg, read: true, status: 'read' as const } : msg
      )
    );
    setSelectedMessages([]);
  };

  const markSelectedAsReplied = () => {
    setMessages(prevMessages =>
      prevMessages.map(msg =>
        selectedMessages.includes(msg.id) ? { ...msg, replied: true, status: 'replied' as const } : msg
      )
    );
    setSelectedMessages([]);
  };

  const archiveSelected = () => {
    setMessages(prevMessages =>
      prevMessages.map(msg =>
        selectedMessages.includes(msg.id) ? { ...msg, status: 'archived' as const } : msg
      )
    );
    setSelectedMessages([]);
  };

  const deleteSelected = () => {
    setMessages(prevMessages => prevMessages.filter(msg => !selectedMessages.includes(msg.id)));
    if (selectedMessage && selectedMessages.includes(selectedMessage.id)) {
      setSelectedMessage(null);
    }
    setSelectedMessages([]);
  };

  // Compter les messages non lus
  const unreadCount = messages.filter(msg => !msg.read).length;
  const repliedCount = messages.filter(msg => msg.replied).length;
  const archivedCount = messages.filter(msg => msg.status === 'archived').length;

  return (
    <div className={styles.messagesContainer}>
      <div className={styles.pageHeader}>
        <h1>Messages de contact</h1>
        <div className={styles.headerActions}>
          <button className={`${styles.btn} ${styles.btnPrimary}`}>
            Nouveau message
          </button>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className={styles.dashboardCards} style={{ marginBottom: '1.5rem' }}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Messages non lus</h3>
            <div className={`${styles.cardIcon} ${styles.blue}`}>
              <FiMail />
            </div>
          </div>
          <p className={styles.cardValue}>{unreadCount}</p>
          <p className={styles.cardLabel}>Nouveaux messages</p>
        </div>
        
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Réponses</h3>
            <div className={`${styles.cardIcon} ${styles.green}`}>
              <FiCheck />
            </div>
          </div>
          <p className={styles.cardValue}>{repliedCount}</p>
          <p className={styles.cardLabel}>Messages répondu</p>
        </div>
        
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>En attente</h3>
            <div className={`${styles.cardIcon} ${styles.orange}`}>
              <FiClock />
            </div>
          </div>
          <p className={styles.cardValue}>{messages.length - unreadCount - repliedCount - archivedCount}</p>
          <p className={styles.cardLabel}>Messages en attente</p>
        </div>
        
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Archivés</h3>
            <div className={`${styles.cardIcon} ${styles.gray}`}>
              <FiAlertCircle />
            </div>
          </div>
          <p className={styles.cardValue}>{archivedCount}</p>
          <p className={styles.cardLabel}>Messages archivés</p>
        </div>
      </div>

      <div className={styles.card} style={{ marginBottom: '1.5rem' }}>
        <div className={styles.filters}>
          <div className={styles.searchBar}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Rechercher un message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          
          <div className={styles.filterGroup}>
            <FiFilter className={styles.filterIcon} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as MessageStatus)}
              className={styles.selectInput}
            >
              <option value="all">Tous les messages</option>
              <option value="unread">Non lus</option>
              <option value="read">Lus</option>
              <option value="replied">Répondu</option>
              <option value="archived">Archivés</option>
            </select>
          </div>
          
          <button 
            className={styles.btn} 
            onClick={() => {
              setStatusFilter('all');
              setSearchTerm('');
            }}
            disabled={!searchTerm && statusFilter === 'all'}
          >
            Réinitialiser
          </button>
        </div>
      </div>

      <div className={styles.messagesLayout}>
        {/* Liste des messages */}
        <div className={`${styles.card} ${styles.messagesList}`}>
          {selectedMessages.length > 0 && (
            <div className={styles.bulkActions}>
              <span>{selectedMessages.length} sélectionné(s)</span>
              <div className={styles.bulkActionButtons}>
                <button 
                  className={`${styles.btn} ${styles.btnSm} ${styles.btnText}`}
                  onClick={markSelectedAsRead}
                >
                  <FiCheck /> Marquer comme lu
                </button>
                <button 
                  className={`${styles.btn} ${styles.btnSm} ${styles.btnText}`}
                  onClick={markSelectedAsReplied}
                >
                  <FiMessageSquare /> Marquer comme répondu
                </button>
                <button 
                  className={`${styles.btn} ${styles.btnSm} ${styles.btnText}`}
                  onClick={archiveSelected}
                >
                  <FiAlertCircle /> Archiver
                </button>
                <button 
                  className={`${styles.btn} ${styles.btnSm} ${styles.btnText} ${styles.danger}`}
                  onClick={deleteSelected}
                >
                  <FiTrash2 /> Supprimer
                </button>
              </div>
            </div>
          )}
          
          {isLoading ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <p>Chargement des messages...</p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className={styles.emptyState}>
              <FiMail className={styles.emptyIcon} />
              <p>Aucun message trouvé</p>
              <button 
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={() => {
                  setStatusFilter('all');
                  setSearchTerm('');
                }}
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className={styles.messagesScrollContainer}>
              {/* Select All Header */}
              <div className={`${styles.messageItem} ${styles.selectAllHeader}`}>
                <div className={styles.messageCheckbox}>
                  <input
                    type="checkbox"
                    checked={selectedMessages.length > 0 && selectedMessages.length === currentMessages.length}
                    onChange={toggleSelectAll}
                    ref={(input) => {
                      if (input) {
                        input.indeterminate = 
                          selectedMessages.length > 0 && 
                          selectedMessages.length < currentMessages.length;
                      }
                    }}
                  />
                  <span className={styles.selectAllText}>
                    {selectedMessages.length > 0 
                      ? `${selectedMessages.length} sélectionné(s)`
                      : 'Tout sélectionner'}
                  </span>
                </div>
              </div>
              
              {currentMessages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`${styles.messageItem} ${
                    selectedMessage?.id === msg.id ? styles.active : ''
                  } ${!msg.read ? styles.unread : ''}`}
                  onClick={() => {
                    setSelectedMessage(msg);
                    if (!msg.read) markAsRead(msg.id);
                  }}
                >
                  <div className={styles.messageCheckbox} onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedMessages.includes(msg.id)}
                      onChange={() => toggleSelectMessage(msg.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className={styles.messageHeader}>
                    <div className={styles.messageSender}>
                      {!msg.read && <span className={styles.unreadBadge}></span>}
                      <strong>{msg.name}</strong>
                    </div>
                    <div className={styles.messageDate}>{formatDate(msg.date)}</div>
                  </div>
                  <div className={styles.messageSubject}>{msg.subject}</div>
                  <div className={styles.messagePreview}>
                    {msg.message.length > 100 ? `${msg.message.substring(0, 100)}...` : msg.message}
                  </div>
                  {msg.tags && msg.tags.length > 0 && (
                    <div className={styles.messageTags}>
                      {msg.tags.map((tag, index) => (
                        <span key={index} className={styles.tag}>{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <div className={styles.paginationInfo}>
                    Affichage de {indexOfFirstMessage + 1} à {Math.min(indexOfLastMessage, filteredMessages.length)} sur {filteredMessages.length} messages
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
            </div>
          )}
        </div>
        
        {/* Détails du message */}
        <div className={`${styles.card} ${styles.messageDetail}`}>
          {selectedMessage ? (
            <>
              <div className={styles.messageToolbar}>
                <div className={styles.messageActions}>
                  <button 
                    className={`${styles.btn} ${styles.btnIcon}`}
                    onClick={() => markAsReplied(selectedMessage.id)}
                    title="Marquer comme répondu"
                  >
                    <FiCheck />
                  </button>
                  <button 
                    className={`${styles.btn} ${styles.btnIcon}`}
                    onClick={() => archiveMessage(selectedMessage.id)}
                    title="Archiver"
                  >
                    <FiAlertCircle />
                  </button>
                  <button 
                    className={`${styles.btn} ${styles.btnIcon} ${styles.danger}`}
                    onClick={() => deleteMessage(selectedMessage.id)}
                    title="Supprimer"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              
              <div className={styles.messageHeader}>
                <h2>{selectedMessage.subject}</h2>
                <div className={styles.messageMeta}>
                  <span className={styles.messageDate}>
                    <FiCalendar /> {formatDate(selectedMessage.date)}
                  </span>
                  {selectedMessage.tags && selectedMessage.tags.length > 0 && (
                    <div className={styles.messageTags}>
                      {selectedMessage.tags.map((tag, index) => (
                        <span key={index} className={styles.tag}>{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className={styles.messageSenderInfo}>
                <div className={styles.senderAvatar}>
                  {selectedMessage.name.charAt(0).toUpperCase()}
                </div>
                <div className={styles.senderDetails}>
                  <div className={styles.senderName}>{selectedMessage.name}</div>
                  <div className={styles.senderEmail}>
                    <FiMail /> {selectedMessage.email}
                  </div>
                  {selectedMessage.phone && (
                    <div className={styles.senderPhone}>
                      <FiPhone /> {selectedMessage.phone}
                    </div>
                  )}
                </div>
              </div>
              
              <div className={styles.messageContent}>
                {selectedMessage.message.split('\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
              
              <div className={styles.messageReply}>
                <h3>Répondre</h3>
                <textarea 
                  className={styles.replyInput} 
                  placeholder="Écrivez votre réponse ici..."
                  rows={5}
                ></textarea>
                <div className={styles.replyActions}>
                  <button 
                    className={`${styles.btn} ${styles.btnPrimary}`}
                    onClick={() => {
                      markAsReplied(selectedMessage.id);
                      // Ici, vous pourriez ajouter la logique pour envoyer la réponse
                    }}
                  >
                    Envoyer la réponse
                  </button>
                  <button className={`${styles.btn} ${styles.btnText}`}>
                    Enregistrer comme brouillon
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className={styles.noMessageSelected}>
              <FiMessageSquare className={styles.noMessageIcon} />
              <p>Sélectionnez un message pour le lire et y répondre</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactMessagesPage;

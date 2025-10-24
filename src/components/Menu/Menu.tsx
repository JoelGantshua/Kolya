import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiShoppingCart, FiPlus, FiMinus, FiX, FiCheck } from 'react-icons/fi';
import type { MenuItem as MenuItemType, CartItem } from '../../types/menu';
import { menuData } from '../../../server/data/menuData.ts';
import MenuItem from './MenuItem.tsx';
import styles from './Menu.module.css';

const Menu = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);

  const categories = [
    { id: 'all', name: 'Tout le menu' },
    { id: 'breakfast', name: 'Petit-déjeuner' },
    { id: 'lunch', name: 'Déjeuner' },
    { id: 'dinner', name: 'Dîner' },
    { id: 'desserts', name: 'Desserts' },
    { id: 'drinks', name: 'Boissons' },
  ];

  const filteredItems = menuData.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const addToCart = (item: MenuItemType) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        return prevItems.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      
      return [
        ...prevItems,
        {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          image: item.image
        }
      ];
    });
    
    // Animation du badge du panier
    const cartButton = document.querySelector(`.${styles.cartButton}`);
    if (cartButton) {
      cartButton.classList.add(styles.pulse);
      setTimeout(() => {
        cartButton.classList.remove(styles.pulse);
      }, 500);
    }
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === itemId);
      
      if (existingItem && existingItem.quantity > 1) {
        return prevItems.map(item =>
          item.id === itemId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      
      return prevItems.filter(item => item.id !== itemId);
    });
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const handleCheckout = () => {
    // Simulation de commande
    setShowOrderSuccess(true);
    setTimeout(() => {
      setCartItems([]);
      setShowOrderSuccess(false);
      setIsCartOpen(false);
    }, 2000);
  };

  // Effet pour gérer la fermeture du panier avec la touche Échap
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        setIsCartOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isCartOpen]);

  return (
    <section className={styles.menuSection} id="menu">
      <div className="container">
        <div className={styles.menuHeader}>
          <h2>Notre Menu</h2>
          <p>Découvrez nos délicieuses spécialités préparées avec des ingrédients frais et de saison</p>
        </div>

        {/* Barre de recherche */}
        <div className={styles.searchBar}>
          <div style={{ position: 'relative' }}>
            <FiSearch style={{
              position: 'absolute',
              left: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#95a5a6'
            }} />
            <input
              type="text"
              placeholder="Rechercher un plat, un ingrédient..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '45px' }}
            />
          </div>
        </div>

        {/* Catégories */}
        <div className={styles.categories}>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`${styles.categoryBtn} ${activeCategory === category.id ? styles.active : ''}`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Liste des plats */}
        <div className={styles.menuItems}>
          <AnimatePresence>
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <MenuItem 
                  key={item.id} 
                  item={item} 
                  onAddToCart={addToCart}
                />
              ))
            ) : (
              <div style={{ 
                gridColumn: '1 / -1', 
                textAlign: 'center', 
                padding: '3rem 0',
                color: '#7f8c8d'
              }}>
                <h3>Aucun plat trouvé</h3>
                <p>Essayez de modifier vos critères de recherche ou de sélectionner une autre catégorie.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bouton du panier */}
      <div className={`${styles.cartButton} ${cartItems.length > 0 ? styles.hasItems : ''}`}>
        <button onClick={() => setIsCartOpen(true)}>
          <FiShoppingCart />
          {cartItems.length > 0 && (
            <span className={styles.cartBadge}>
              {getTotalItems()}
            </span>
          )}
        </button>
      </div>

      {/* Panier latéral */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              className={styles.cartOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
            />
            <motion.div 
              className={styles.cartSidebar}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween' }}
            >
              <div className={styles.cartHeader}>
                <h3>Votre Panier</h3>
                <button onClick={() => setIsCartOpen(false)}>
                  <FiX />
                </button>
              </div>

              <div className={styles.cartItems}>
                {cartItems.length === 0 ? (
                  <div className={styles.emptyCart}>
                    <p>Votre panier est vide</p>
                    <p>Ajoutez des plats pour commencer votre commande</p>
                  </div>
                ) : (
                  <>
                    {cartItems.map((item) => (
                      <div key={item.id} className={styles.cartItem}>
                        <div className={styles.cartItemInfo}>
                          <h4>{item.name}</h4>
                          <p>
                            {item.price.toFixed(2)} €
                            <span className={styles.cartItemPrice}>
                              x {item.quantity} = {(item.price * item.quantity).toFixed(2)} €
                            </span>
                          </p>
                        </div>
                        <div className={styles.cartItemActions}>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromCart(item.id);
                            }}
                            aria-label="Diminuer la quantité"
                          >
                            <FiMinus size={14} />
                          </button>
                          <span>{item.quantity}</span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              updateQuantity(item.id, item.quantity + 1);
                            }}
                            aria-label="Augmenter la quantité"
                          >
                            <FiPlus size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>

              {cartItems.length > 0 && (
                <div className={styles.cartFooter}>
                  <div className={styles.cartTotal}>
                    <span>Total</span>
                    <span>{getTotalPrice()} €</span>
                  </div>
                  <button 
                    className={styles.checkoutBtn}
                    onClick={handleCheckout}
                    disabled={showOrderSuccess}
                  >
                    {showOrderSuccess ? (
                      <>
                        <FiCheck /> Commande validée !
                      </>
                    ) : (
                      'Valider la commande'
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Menu;

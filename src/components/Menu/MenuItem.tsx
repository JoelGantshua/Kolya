import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { FaLeaf, FaPepperHot, FaSeedling, FaBreadSlice } from 'react-icons/fa';
import type { MenuItem as MenuItemType } from '../../types/menu';
import styles from './Menu.module.css';

interface MenuItemProps {
  item: MenuItemType;
  onAddToCart: (item: MenuItemType) => void;
}

const MenuItem = ({ item, onAddToCart }: MenuItemProps) => {
  const [quantity, setQuantity] = useState(1);
  const [showDetails, setShowDetails] = useState(false);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(item);
    setQuantity(1);
  };

  const formattedPrice = item.price.toFixed(2);
  const hasTags = item.isVegetarian || item.isVegan || item.isSpicy || item.isGlutenFree;

  return (
    <motion.div 
      className={styles.menuItem}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      onClick={() => setShowDetails(!showDetails)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && setShowDetails(!showDetails)}
    >
      <div className={styles.itemImage}>
        <img 
          src={item.image} 
          alt={item.name}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/3.jpg';
          }}
          loading="lazy"
        />
        {item.isPopular && (
          <span className={styles.popularBadge}>
            Populaire
          </span>
        )}
      </div>
      
      <div className={styles.itemContent}>
        <div className={styles.itemHeader}>
          <h3>{item.name}</h3>
          <span className={styles.itemPrice}>{formattedPrice} €</span>
        </div>
        
        <p className={styles.itemDescription}>
          {showDetails 
            ? item.description 
            : `${item.description.substring(0, 80)}${item.description.length > 80 ? '...' : ''}`
          }
          {item.description.length > 80 && (
            <button 
              className={styles.readMoreBtn}
              onClick={(e) => {
                e.stopPropagation();
                setShowDetails(!showDetails);
              }}
              aria-label={showDetails ? 'Voir moins de détails' : 'Voir plus de détails'}
            >
              {showDetails ? 'Voir moins' : 'Voir plus'}
            </button>
          )}
        </p>

        {showDetails && item.ingredients && (
          <div className={styles.ingredients}>
            <h4>Ingrédients :</h4>
            <ul>
              {item.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
            {item.calories && (
              <p className={styles.calories}>
                Environ {item.calories} calories
              </p>
            )}
          </div>
        )}

        {hasTags && (
          <div className={styles.itemTags}>
            {item.isVegan ? (
              <span className={styles.tag}>
                <FaLeaf /> Végétalien
              </span>
            ) : item.isVegetarian ? (
              <span className={styles.tag}>
                <FaSeedling /> Végétarien
              </span>
            ) : null}
            {item.isSpicy && (
              <span className={styles.tag}>
                <FaPepperHot /> Épicé
              </span>
            )}
            {item.isGlutenFree && (
              <span className={styles.tag}>
                <FaBreadSlice /> Sans gluten
              </span>
            )}
          </div>
        )}

        <div className={styles.itemActions} onClick={e => e.stopPropagation()}>
          <div className={styles.quantitySelector}>
            <button 
              onClick={() => handleQuantityChange(quantity - 1)}
              aria-label="Diminuer la quantité"
            >
              <FiMinus size={14} />
            </button>
            <span>{quantity}</span>
            <button 
              onClick={() => handleQuantityChange(quantity + 1)}
              aria-label="Augmenter la quantité"
            >
              <FiPlus size={14} />
            </button>
          </div>
          
          <button 
            className={styles.addToCartBtn}
            onClick={handleAddToCart}
            aria-label={`Ajouter ${quantity} ${item.name} au panier`}
          >
            <FiPlus /> Ajouter
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuItem;

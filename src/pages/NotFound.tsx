// src/pages/NotFound.tsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import styles from '../styles/pages.module.css';

const NotFound = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={styles.notFound}
    >
      <h1>404 - Page non trouvée</h1>
      <p>Désolé, la page que vous recherchez n'existe pas ou a été déplacée.</p>
      <Link to="/" className="btn-primary">
        Retour à l'accueil
      </Link>
    </motion.div>
  );
};

export default NotFound;
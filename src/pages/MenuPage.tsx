// src/pages/MenuPage.tsx
import { motion } from 'framer-motion';
import Menu from '../components/Menu/Menu';
import styles from '../styles/pages.module.css';

const MenuPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={styles.menuPage}
      id="menu"
    >
      <Menu />
    </motion.div>
  );
};

export default MenuPage;
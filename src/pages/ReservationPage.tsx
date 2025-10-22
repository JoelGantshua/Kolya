// src/pages/ReservationPage.tsx
import { motion } from 'framer-motion';
import Reservation from '../components/Reservation/Reservation';
import styles from '../styles/pages.module.css';

const ReservationPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={styles.reservationPage}
      id="reservation"
    >
      <Reservation />
    </motion.div>
  );
};

export default ReservationPage;
// src/pages/AboutPage.tsx
import { motion } from 'framer-motion';
import About from '../components/About/About';
import styles from '../styles/pages.module.css';


const AboutPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={styles.aboutPage}
      id="about"
    >
      <About />
    </motion.div>
  );
};

export default AboutPage;
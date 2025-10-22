// src/pages/GalleryPage.tsx
import { motion } from 'framer-motion';
import Gallery from '../components/Gallery/Gallery';
import styles from '../styles/pages.module.css';

const GalleryPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={styles.galleryPage}
      id="gallery"
    >
      <Gallery />
    </motion.div>
  );
};

export default GalleryPage;
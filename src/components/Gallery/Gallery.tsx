import { useState } from 'react';
import { motion, AnimatePresence, } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import styles from './Gallery.module.css';

const GALLERY_IMAGES = [
  {
    id: 1,
    src: 'https://res.cloudinary.com/debaxegie/image/upload/v1760550908/Copie_de_k_Lya_imdcdc.png',
    alt: 'Intérieur du restaurant Kolya',
    category: 'interior',
  },
  {
    id: 2,
    src: 'https://res.cloudinary.com/debaxegie/image/upload/v1760607628/IMG_0097_mmmb0b.jpg',
    alt: 'Plat signature du chef',
    category: 'food',
  },
  {
    id: 3,
    src: 'https://res.cloudinary.com/debaxegie/image/upload/v1760607628/IMG_0093_sbuvig.jpg',
    alt: 'Dessert maison',
    category: 'food',
  },
  {
    id: 4,
    src: 'https://res.cloudinary.com/debaxegie/image/upload/v1760607628/IMG_0096_lkn3km.jpg',
    alt: 'Cocktails artisanaux',
    category: 'drinks',
  },
  {
    id: 5,
    src: 'https://res.cloudinary.com/debaxegie/image/upload/v1760607628/IMG_0095_jven7z.jpg',
    alt: 'Salle à manger élégante',
    category: 'interior',
  },
  {
    id: 6,
    src: 'https://res.cloudinary.com/debaxegie/image/upload/v1760607629/IMG_0094_y9s5jz.jpg',
    alt: 'Présentation culinaire raffinée',
    category: 'food',
  },
  {
    id: 7,
    src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
    alt: 'Bar raffiné',
    category: 'interior',
  },
  {
    id: 8,
    src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
    alt: 'Plat gastronomique',
    category: 'food',
  },
];

const categories = [
  { id: 'all', name: 'Toutes les photos' },
  { id: 'food', name: 'Nos plats' },
  { id: 'interior', name: 'Notre espace' },
  { id: 'drinks', name: 'Nos boissons' },
];

// Variants Framer Motion
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  hover: { scale: 1.03, transition: { duration: 0.3, ease: 'easeInOut' } },
};

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2, ease: 'easeIn' } },
};

const imageVariants: Variants = {
  enter: ({ direction }: { direction: number }) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } },
  },
  exit: ({ direction }: { direction: number }) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    transition: { x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } },
  }),
};

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  const filteredImages =
    selectedCategory === 'all'
      ? GALLERY_IMAGES
      : GALLERY_IMAGES.filter((image) => image.category === selectedCategory);

  const openLightbox = (index: number) => {
    setSelectedImage(index);
    document.body.style.overflow = 'hidden';
    setIsMounted(true);
  };

  const closeLightbox = () => {
    setIsMounted(false);
    setTimeout(() => {
      setSelectedImage(null);
      document.body.style.overflow = 'auto';
    }, 300);
  };

  const navigate = (navDirection: 'prev' | 'next') => {
    if (selectedImage === null) return;

    const total = filteredImages.length;
    setDirection(navDirection === 'next' ? 1 : -1);

    if (navDirection === 'next') setSelectedImage((selectedImage + 1) % total);
    else setSelectedImage((selectedImage - 1 + total) % total);
  };

  return (
    <section className={styles.gallery} id="gallery">
      <div className="container">
        <h2 className={styles.sectionTitle}>Notre Galerie</h2>

        {/* Category Filter */}
        <motion.div
          className={styles.filterContainer}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {categories.map((category) => (
            <button
              key={category.id}
              className={`${styles.filterButton} ${
                selectedCategory === category.id ? styles.active : ''
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </motion.div>

        {/* Gallery Grid */}
        <motion.div className={styles.galleryGrid} variants={containerVariants} initial="hidden" animate="visible">
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              className={styles.galleryItem}
              variants={itemVariants}
              whileHover="hover"
              onClick={() => openLightbox(index)}
            >
              <img src={image.src} alt={image.alt} className={styles.galleryImage} loading="lazy" />
              <div className={styles.imageOverlay}>
                <span>{image.alt}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {isMounted && selectedImage !== null && (
          <motion.div
            className={styles.lightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <motion.div
              className={styles.lightboxContent}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <button className={styles.closeButton} onClick={closeLightbox}>
                <FaTimes />
              </button>

              <AnimatePresence custom={{ direction }} mode="wait">
                <motion.div
                  key={selectedImage}
                  className={styles.lightboxImageContainer}
                  custom={{ direction }}
                  variants={imageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  <img
                    src={filteredImages[selectedImage].src}
                    alt={filteredImages[selectedImage].alt}
                    className={styles.lightboxImage}
                  />
                </motion.div>
              </AnimatePresence>

              <button
                className={`${styles.navButton} ${styles.prevButton}`}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('prev');
                }}
              >
                <FaChevronLeft />
              </button>
              <button
                className={`${styles.navButton} ${styles.nextButton}`}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('next');
                }}
              >
                <FaChevronRight />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;

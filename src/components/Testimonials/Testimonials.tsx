import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { FaQuoteLeft, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import styles from './Testimonials.module.css';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
  date: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Sophie Martin',
    role: 'Food Blogger',
    content:
      "Une expérience culinaire exceptionnelle ! Les saveurs sont uniques et les plats sont magnifiquement présentés. Le service est impeccable et l'ambiance est chaleureuse. Je recommande vivement !",
    rating: 5,
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    date: '15 mars 2024',
  },
  {
    id: 2,
    name: 'Thomas Dubois',
    role: 'Critique culinaire',
    content:
      'La fusion des saveurs africaines et européennes est tout simplement magistrale. Chaque bouchée est une découverte. Le chef a su créer une identité culinaire unique.',
    rating: 5,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    date: '2 avril 2024',
  },
  {
    id: 3,
    name: 'Amélie Laurent',
    role: 'Influenceuse',
    content:
      "L'ambiance est à la fois élégante et décontractée. Les plats sont des œuvres d'art comestibles. Mention spéciale pour les desserts qui sont à tomber !",
    rating: 4,
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    date: '22 mars 2024',
  },
  {
    id: 4,
    name: 'Jean Dupont',
    role: 'Voyageur fréquent',
    content:
      "Un véritable voyage des sens. Les épices sont parfaitement dosées et les produits sont d'une fraîcheur remarquable. À ne pas manquer !",
    rating: 5,
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
    date: '10 avril 2024',
  },
  {
    id: 5,
    name: 'Marie Leroy',
    role: 'Cheffe à domicile',
    content:
      'Je suis impressionnée par la créativité des plats. La présentation est soignée et les saveurs sont équilibrées. Un régal pour les yeux et les papilles !',
    rating: 5,
    avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    date: '5 avril 2024',
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || touchEnd === null) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) nextSlide();
    else if (isRightSwipe) prevSlide();
  };

  // Auto slide
  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(timer);
  }, [currentIndex, isAutoPlaying]);

  const nextSlide = () => {
    setDirection('right');
    setCurrentIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setDirection('left');
    setCurrentIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 'right' : 'left');
    setCurrentIndex(index);
  };

  const variants: Variants = {
    enter: ({ direction }: { direction: 'left' | 'right' }) => ({
      x: direction === 'right' ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
      },
    },
    exit: ({ direction }: { direction: 'left' | 'right' }) => ({
      x: direction === 'right' ? '-100%' : '100%',
      opacity: 0,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  const renderStars = (rating: number) =>
    Array(5)
      .fill(0)
      .map((_, i) => (
        <FaStar
          key={i}
          className={`${styles.star} ${i < rating ? styles.filled : ''}`}
          aria-hidden="true"
        />
      ));

  return (
    <section id="testimonials" className={styles.testimonials}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionSubtitle}>Témoignages</span>
          <h2 className={styles.sectionTitle}>Ce que disent nos clients</h2>
          <p className={styles.sectionDescription}>
            Découvrez les avis de nos convives sur leur expérience au restaurant Kolya
          </p>
        </div>

        <div
          className={styles.testimonialSlider}
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <button
            className={`${styles.navButton} ${styles.prevButton}`}
            onClick={prevSlide}
            aria-label="Témoignage précédent"
          >
            <FaChevronLeft />
          </button>

          <div className={styles.sliderContent}>
            <AnimatePresence mode="wait" custom={{ direction }} initial={false}>
              <motion.div
                key={currentIndex}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                custom={{ direction }}
                className={styles.testimonialItem}
              >
                <div className={styles.quoteIcon}>
                  <FaQuoteLeft />
                </div>

                <p className={styles.testimonialContent}>
                  {TESTIMONIALS[currentIndex].content}
                </p>

                <div className={styles.rating}>
                  {renderStars(TESTIMONIALS[currentIndex].rating)}
                  <span className={styles.ratingText}>
                    {TESTIMONIALS[currentIndex].rating}.0/5.0
                  </span>
                </div>

                <div className={styles.author}>
                  <div className={styles.avatar}>
                    <img
                      src={TESTIMONIALS[currentIndex].avatar}
                      alt={TESTIMONIALS[currentIndex].name}
                      width={60}
                      height={60}
                      loading="lazy"
                    />
                  </div>
                  <div className={styles.authorInfo}>
                    <h4 className={styles.authorName}>
                      {TESTIMONIALS[currentIndex].name}
                    </h4>
                    <p className={styles.authorRole}>
                      {TESTIMONIALS[currentIndex].role}
                    </p>
                    <span className={styles.testimonialDate}>
                      {TESTIMONIALS[currentIndex].date}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            className={`${styles.navButton} ${styles.nextButton}`}
            onClick={nextSlide}
            aria-label="Témoignage suivant"
          >
            <FaChevronRight />
          </button>
        </div>

        <div className={styles.dots}>
          {TESTIMONIALS.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${
                index === currentIndex ? styles.active : ''
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Aller au témoignage ${index + 1}`}
              aria-current={index === currentIndex ? 'step' : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

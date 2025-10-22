import { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import type { Variants } from 'framer-motion';
import styles from './Hero.module.css';

const container: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3, delayChildren: 0.2 },
  },
};

const item: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

const button: Variants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { delay: 0.6, duration: 0.5 },
  },
  hover: { scale: 1.05, transition: { duration: 0.3 } },
  tap: { scale: 0.95 },
};

const Hero = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) controls.start('visible');
  }, [controls, isInView]);

  return (
    <section id="home" className={styles.hero} ref={ref}>
      <div className={styles.overlay}></div>
      <motion.div className={styles.heroContent} variants={container} initial="hidden" animate={controls}>
        <motion.h2 variants={item}>Bienvenue chez Kolya</motion.h2>
        <motion.p variants={item}>
          Découvrez une expérience culinaire unique où se rencontrent les saveurs africaines et européennes
        </motion.p>
        <motion.a
          href="#reservation"
          className={styles.ctaButton}
          variants={button}
          whileHover="hover"
          whileTap="tap"
        >
          Réserver une table
        </motion.a>
      </motion.div>
    </section>
  );
};

export default Hero;

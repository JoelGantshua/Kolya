import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { FaUtensils, FaAward, FaLeaf } from 'react-icons/fa';
import { useEffect, useRef } from 'react';
import styles from './About.module.css';

// ✅ Mets ta vidéo dans : public/video/about-video.mp4
// puis modifie le chemin ci-dessous :
const aboutVideo = '/video/about-video.mp4';

const container: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
};

const item: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const About = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // ✅ Joue la vidéo dès le montage (pas de dépendance à la vue)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.play().catch((error) => {
      console.log('Lecture auto bloquée :', error);
    });
  }, []);

  const stats = [
    { id: 1, icon: <FaUtensils className={styles.statIcon} />, number: '50+', label: 'Plats uniques' },
    { id: 2, icon: <FaAward className={styles.statIcon} />, number: '15', label: "Années d'expérience" },
    { id: 3, icon: <FaLeaf className={styles.statIcon} />, number: '100%', label: 'Ingrédients frais' },
  ];

  return (
    <section id="about" className={styles.about}>
      <div className="container">
        <div className={styles.aboutGrid}>
          {/* Texte à gauche */}
          <motion.div
            className={styles.aboutContent}
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.span className={styles.sectionSubtitle} variants={item}>
              Notre Histoire
            </motion.span>
            <motion.h2 className={styles.sectionTitle} variants={item}>
              Une Passion pour l'Excellence Culinaire
            </motion.h2>
            <motion.p className={styles.aboutText} variants={item}>
              Fondé en 2010, Kolya est né de la passion pour la cuisine africaine revisitée avec une touche européenne.
            </motion.p>
            <motion.p className={styles.aboutText} variants={item}>
              Chaque plat est une œuvre d'art, préparé avec des ingrédients frais et des épices soigneusement sélectionnés.
            </motion.p>

            <motion.div className={styles.statsGrid} variants={container}>
              {stats.map((stat) => (
                <motion.div key={stat.id} className={styles.statItem} variants={item}>
                  <div className={styles.statIconWrapper}>{stat.icon}</div>
                  <h3 className={styles.statNumber}>{stat.number}</h3>
                  <p className={styles.statLabel}>{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Vidéo à droite */}
          <motion.div
            className={styles.videoWrapper}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0, transition: { duration: 0.8 } }}
            viewport={{ once: true }}
          >
            <div className={styles.videoContainer}>
              <video
                ref={videoRef}
                className={styles.video}
                muted
                loop
                playsInline
                preload="auto"
                autoPlay
              >
                <source src={aboutVideo} type="video/mp4" />
                Votre navigateur ne supporte pas la lecture de vidéos.
              </video>
              {/* Retrait de l’overlay qui assombrissait et faisait disparaître la vidéo */}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;

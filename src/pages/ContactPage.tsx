// src/pages/ContactPage.tsx
import { motion } from 'framer-motion';
import styles from '../styles/pages.module.css';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';

const ContactPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={styles.contactPage}
      id="contact"
    >
      <motion.h1 variants={itemVariants}>Contactez-nous</motion.h1>
      
      <div className={styles.contactContainer}>
        <motion.div className={styles.contactInfo} variants={itemVariants}>
          <h2>Informations de contact</h2>
          <div className={styles.contactItem}>
            <FaMapMarkerAlt className={styles.contactIcon} />
            <div>
              <h3>Adresse</h3>
              <p>123 Rue du Restaurant<br />75000 Paris, France</p>
            </div>
          </div>
          <div className={styles.contactItem}>
            <FaPhone className={styles.contactIcon} />
            <div>
              <h3>Téléphone</h3>
              <p>+33 1 23 45 67 89</p>
            </div>
          </div>
          <div className={styles.contactItem}>
            <FaEnvelope className={styles.contactIcon} />
            <div>
              <h3>Email</h3>
              <p>contact@restaurant.com</p>
            </div>
          </div>
          <div className={styles.contactItem}>
            <FaClock className={styles.contactIcon} />
            <div>
              <h3>Horaires d'ouverture</h3>
              <p>Lundi - Vendredi: 12h00 - 14h30, 19h00 - 22h30<br />
              Samedi - Dimanche: 19h00 - 23h00</p>
            </div>
          </div>
        </motion.div>

        <motion.div className={styles.contactForm} variants={itemVariants}>
          <h2>Envoyez-nous un message</h2>
          <form className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Nom complet *</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                required 
                className={styles.formControl}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email *</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                required 
                className={styles.formControl}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="subject">Sujet</label>
              <input 
                type="text" 
                id="subject" 
                name="subject" 
                className={styles.formControl}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="message">Message *</label>
              <textarea 
                id="message" 
                name="message" 
                rows={5} 
                required 
                className={styles.formControl}
              ></textarea>
            </div>
            <button type="submit" className={styles.submitButton}>
              Envoyer le message
            </button>
          </form>
        </motion.div>
      </div>

      <motion.div className={styles.mapContainer} variants={itemVariants}>
        <h2>Nous trouver</h2>
        <div className={styles.mapWrapper}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.9916256937595!2d2.292292615674536!3d48.85837007928747!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e2964e34e2d%3A0x8ddca9ee380ef7e0!2sTour%20Eiffel!5e0!3m2!1sfr!2sfr!4v1620000000000!5m2!1sfr!2sfr"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            title="Localisation du restaurant"
          ></iframe>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ContactPage;
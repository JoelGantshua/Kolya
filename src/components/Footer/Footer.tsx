import { FaInstagram, FaFacebook, FaTwitter, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaCcVisa, FaCcMastercard, FaCcPaypal } from 'react-icons/fa';
import { SiTripadvisor } from 'react-icons/si';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.topSection}>
        <div className={styles.container}>
          <div className={styles.footerGrid}>
            {/* Colonne 1: Logo et description */}
            <div className={styles.footerColumn}>
              <div className={styles.logo}>Kolya</div>
              <p className={styles.description}>
                Une expérience culinaire unique alliant les saveurs africaines à la finesse européenne. 
                Découvrez l'art de la gastronomie dans un cadre élégant et chaleureux.
              </p>
              <div className={styles.socialIcons}>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <FaInstagram className={styles.icon} />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <FaFacebook className={styles.icon} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <FaTwitter className={styles.icon} />
                </a>
                <a href="https://tripadvisor.com" target="_blank" rel="noopener noreferrer" aria-label="TripAdvisor">
                  <SiTripadvisor className={styles.icon} />
                </a>
              </div>
            </div>

            {/* Colonne 2: Horaires */}
            <div className={styles.footerColumn}>
              <h3 className={styles.columnTitle}>Horaires d'ouverture</h3>
              <ul className={styles.hoursList}>
                <li className={styles.hoursItem}>
                  <FaClock className={styles.hoursIcon} />
                  <div>
                    <span className={styles.day}>Lundi - Jeudi</span>
                    <span className={styles.hours}>12h00 - 22h30</span>
                  </div>
                </li>
                <li className={styles.hoursItem}>
                  <FaClock className={styles.hoursIcon} />
                  <div>
                    <span className={styles.day}>Vendredi - Samedi</span>
                    <span className={styles.hours}>12h00 - 23h30</span>
                  </div>
                </li>
                <li className={styles.hoursItem}>
                  <FaClock className={styles.hoursIcon} />
                  <div>
                    <span className={styles.day}>Dimanche</span>
                    <span className={styles.hours}>11h30 - 21h30</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Colonne 3: Contact */}
            <div className={styles.footerColumn}>
              <h3 className={styles.columnTitle}>Contactez-nous</h3>
              <ul className={styles.contactList}>
                <li className={styles.contactItem}>
                  <FaMapMarkerAlt className={styles.contactIcon} />
                  <span>123 Avenue des Saveurs, 75001 Paris, France</span>
                </li>
                <li className={styles.contactItem}>
                  <FaPhone className={styles.contactIcon} />
                  <a href="tel:+33123456789">+33 1 23 45 67 89</a>
                </li>
                <li className={styles.contactItem}>
                  <FaEnvelope className={styles.contactIcon} />
                  <a href="mailto:contact@kolya-restaurant.com">contact@kolya-restaurant.com</a>
                </li>
              </ul>
              
              <div className={styles.newsletter}>
                <h4 className={styles.newsletterTitle}>Newsletter</h4>
                <p className={styles.newsletterText}>Inscrivez-vous pour recevoir nos offres spéciales</p>
                <form className={styles.newsletterForm}>
                  <input 
                    type="email" 
                    placeholder="Votre adresse email" 
                    className={styles.newsletterInput} 
                    required 
                  />
                  <button type="submit" className={styles.newsletterButton}>S'inscrire</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.bottomSection}>
        <div className={styles.container}>
          <div className={styles.bottomContent}>
            <div className={styles.copyright}>
              &copy; {currentYear} Kolya Restaurant. Tous droits réservés.
            </div>
            
            <div className={styles.legalLinks}>
              <a href="/mentions-legales" className={styles.legalLink}>Mentions légales</a>
              <span className={styles.divider}>|</span>
              <a href="/politique-confidentialite" className={styles.legalLink}>Politique de confidentialité</a>
              <span className={styles.divider}>|</span>
              <a href="/cgv" className={styles.legalLink}>CGV</a>
              <span className={styles.divider}>|</span>
              <a href="/plan-du-site" className={styles.legalLink}>Plan du site</a>
            </div>
            
            <div className={styles.paymentMethods}>
              <FaCcVisa className={styles.paymentIcon} />
              <FaCcMastercard className={styles.paymentIcon} />
              <FaCcPaypal className={styles.paymentIcon} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

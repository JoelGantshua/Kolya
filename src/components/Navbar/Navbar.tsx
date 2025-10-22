import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaShoppingCart, FaUser } from 'react-icons/fa';
import styles from './Navbar.module.css';
import logo from '../../assets/nav.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    setIsLoggedIn(!!authStatus);
  }, [location]);

  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLoggedIn) {
      navigate('/login');
    } else {
      navigate('/Dashboard');
    }
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { path: '#home', label: 'Accueil' },
    { path: '#menu', label: 'Menu' },
    { path: '#about', label: 'À propos' },
    { path: '#gallery', label: 'Galerie' },
    { path: '#contact', label: 'Contact' },
  ];

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    if (path.startsWith('#')) {
      const element = document.querySelector(path);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = path;
    }
    setIsOpen(false);
  };

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <img src={logo} alt="Logo du restaurant" />
        </Link>

        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {navLinks.map((link) => (
              <li key={link.path} className={styles.navItem}>
                <Link
                  to={link.path}
                  className={`${styles.navLink} ${location.hash === link.path ? styles.active : ''}`}
                  onClick={(e) => handleSmoothScroll(e, link.path)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            to="#reservation"
            className={styles.reservationButton}
            onClick={(e) => handleSmoothScroll(e, '#reservation')}
          >
            Réserver une table
          </Link>

          <button
            onClick={handleLoginClick}
            className={`${styles.cartButton} ${isLoggedIn ? styles.loggedIn : ''}`}
            title={isLoggedIn ? 'Accéder au tableau de bord' : 'Se connecter'}
          >
            {isLoggedIn ? (
              <FaUser className={styles.cartIcon} />
            ) : (
              <FaShoppingCart className={styles.cartIcon} />
            )}
          </button>
        </nav>

        <button className={styles.menuButton} onClick={toggleMenu} aria-label="Menu">
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ul className={styles.mobileNavList}>
              {navLinks.map((link) => (
                <li key={link.path} className={styles.mobileNavItem}>
                  <Link
                    to={link.path}
                    className={`${styles.mobileNavLink} ${location.hash === link.path ? styles.active : ''}`}
                    onClick={(e) => handleSmoothScroll(e, link.path)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className={styles.mobileNavItem}>
                <Link
                  to="/reservation"
                  className={styles.mobileReservationButton}
                  onClick={(e) => handleSmoothScroll(e, '/reservation')}
                >
                  Réserver une table
                </Link>
              </li>
              <li className={styles.mobileNavItem}>
                <button onClick={handleLoginClick} className={styles.mobileLoginButton}>
                  {isLoggedIn ? 'Tableau de bord' : 'Connexion'}
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;

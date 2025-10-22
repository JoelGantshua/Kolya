import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FiLock, FiMail, FiLogIn } from 'react-icons/fi';
import styles from './Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Récupère la page demandée avant redirection
  const from = (location.state as { from?: string })?.from || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);

    try {
      // Simulation d'une requête API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Connexion réussie → stocker l'état dans localStorage
      localStorage.setItem('isAuthenticated', 'true');

      // ✅ Redirige vers la page d'origine ou vers /dashboard
      navigate(from, { replace: true });

    } catch (err) {
      setError('Une erreur est survenue lors de la connexion');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <h1>Connexion</h1>
          <p>Accédez à votre tableau de bord</p>
        </div>

        {error && <div className={styles.alertError}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Adresse email</label>
            <div className={styles.inputGroup}>
              <span className={styles.inputIcon}><FiMail /></span>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                disabled={isLoading}
                className={styles.formControl}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label htmlFor="password">Mot de passe</label>
              <Link to="/forgot-password" className={styles.forgotPassword}>
                Mot de passe oublié ?
              </Link>
            </div>
            <div className={styles.inputGroup}>
              <span className={styles.inputIcon}><FiLock /></span>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                className={styles.formControl}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className={`${styles.btn} ${styles.btnPrimary} ${styles.btnBlock}`}
            disabled={isLoading}
          >
            {isLoading ? 'Connexion en cours...' : (
              <>
                <FiLogIn style={{ marginRight: '8px' }} />
                Se connecter
              </>
            )}
          </button>
        </form>

        <div className={styles.loginFooter}>
          <p>
            Vous n'avez pas de compte ?{' '}
            <Link to="/register" className={styles.registerLink}>
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

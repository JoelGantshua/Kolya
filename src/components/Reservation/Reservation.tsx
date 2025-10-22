import { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaUsers, FaCalendarAlt, FaClock, FaUtensils } from 'react-icons/fa';
import { motion } from 'framer-motion';
import styles from './Reservation.module.css';

const Reservation = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    occasion: '',
    specialRequests: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{success: boolean; message: string} | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Réussite de la réservation
      setSubmitStatus({
        success: true,
        message: 'Votre réservation a été enregistrée avec succès ! Nous vous contacterons bientôt pour confirmation.'
      });
      
      // Réinitialiser le formulaire
      setFormData({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        guests: '2',
        occasion: '',
        specialRequests: ''
      });
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: 'Une erreur est survenue lors de la réservation. Veuillez réessayer plus tard.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Générer les options d'heures (12h-22h par incréments de 30 minutes)
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 12; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push(
          <option key={timeString} value={timeString}>
            {timeString}
          </option>
        );
      }
    }
    return times;
  };

  // Calculer la date minimale (aujourd'hui) et maximale (3 mois à partir d'aujourd'hui)
  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateString = maxDate.toISOString().split('T')[0];

  return (
    <section id="reservation" className={styles.reservation}>
      <div className={styles.container}>
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          
        >
          <span className={styles.subtitle}>Réservation</span>
          <h2 className={styles.title}>Réservez votre table</h2>
          <p className={styles.description}>
            Réservez votre table pour une expérience culinaire inoubliable. Notre équipe se fera un plaisir de vous accueillir.
          </p>
        </motion.div>

        <motion.div 
          className={styles.formContainer}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {submitStatus && (
            <div className={`${styles.alert} ${submitStatus.success ? styles.success : styles.error}`}>
              {submitStatus.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>
                  <FaUser className={styles.icon} /> Nom complet *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Votre nom complet"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>
                  <FaEnvelope className={styles.icon} /> Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="votre@email.com"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone" className={styles.label}>
                  <FaPhone className={styles.icon} /> Téléphone *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="06 12 34 56 78"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="date" className={styles.label}>
                  <FaCalendarAlt className={styles.icon} /> Date *
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={styles.input}
                  min={today}
                  max={maxDateString}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="time" className={styles.label}>
                  <FaClock className={styles.icon} /> Heure *
                </label>
                <select
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className={styles.select}
                  required
                >
                  <option value="">Sélectionnez une heure</option>
                  {generateTimeOptions()}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="guests" className={styles.label}>
                  <FaUsers className={styles.icon} /> Nombre de personnes *
                </label>
                <select
                  id="guests"
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  className={styles.select}
                  required
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'personne' : 'personnes'}
                    </option>
                  ))}
                  <option value="12+">12+ (Groupe)</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="occasion" className={styles.label}>
                  <FaUtensils className={styles.icon} /> Occasion (optionnel)
                </label>
                <select
                  id="occasion"
                  name="occasion"
                  value={formData.occasion}
                  onChange={handleChange}
                  className={styles.select}
                >
                  <option value="">Sélectionnez une occasion</option>
                  <option value="anniversaire">Anniversaire</option>
                  <option value="anniversaire">Anniversaire de mariage</option>
                  <option value="business">Dîner d'affaires</option>
                  <option value="rendez-vous">Rendez-vous</option>
                  <option value="famille">Repas en famille</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="specialRequests" className={styles.label}>
                Demandes spéciales (optionnel)
              </label>
              <textarea
                id="specialRequests"
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleChange}
                className={styles.textarea}
                placeholder="Allergies, fauteuils hauts, etc."
                rows={4}
              />
            </div>

            <div className={styles.privacyNote}>
              En soumettant ce formulaire, vous acceptez notre <a href="/politique-confidentialite" className={styles.privacyLink}>
                politique de confidentialité
              </a>. Vos informations ne seront pas partagées avec des tiers.
            </div>

            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Traitement...' : 'Réserver maintenant'}
            </button>
          </form>
        </motion.div>

        <div className={styles.contactInfo}>
          <div className={styles.contactCard}>
            <h3 className={styles.contactTitle}>Contact direct</h3>
            <p className={styles.contactText}>
              Pour les réservations de groupe (plus de 12 personnes) ou les demandes spéciales, n'hésitez pas à nous contacter directement.
            </p>
            <div className={styles.contactDetails}>
              <a href="tel:+33123456789" className={styles.contactLink}>
                <FaPhone className={styles.contactIcon} /> +33 1 23 45 67 89
              </a>
              <a href="mailto:reservations@kolya-restaurant.com" className={styles.contactLink}>
                <FaEnvelope className={styles.contactIcon} /> reservations@kolya-restaurant.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reservation;

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: "Bienvenue sur l'API du restaurant Kolya" });
});

// Importation des routes
const authRoutes = require('./routes/auth');
const dishRoutes = require('./routes/dishes');

// Montage des routeurs
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/dishes', dishRoutes);

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Erreur serveur'
  });
});

// Connexion à MongoDB et démarrage du serveur
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connecté à MongoDB');
    const server = app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
    // Gestion des erreurs non capturées
    process.on('unhandledRejection', (err, promise) => {
      console.error(`Erreur: ${err.message}`);
      // Fermer le serveur et arrêter le processus
      server.close(() => process.exit(1));
    });
  })
  .catch(err => {
    console.error('Erreur de connexion à MongoDB:', err.message);
    process.exit(1);
  });

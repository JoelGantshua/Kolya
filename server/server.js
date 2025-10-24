require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const http = require('http');
const socketIo = require('socket.io');
const dishRoutes = require('./routes/dishes');
const orderRoutes = require('./routes/orders');
const galleryRoutes = require('./routes/gallery');
const authRoutes = require('./routes/auth');
const ReservationRoutes = require('./routes/reservations');

// monter les routes 
app.use('/api/v1/dishes', dishRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/gallery', galleryRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/reservations', ReservationRoutes);



// Créer le serveur HTTP
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
cors: {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  methods: ['GET', 'POST']
}
});

// stocker l'instance io
app.set('io', io);

// socket.io
io.on('connection', (socket) => {
  console.log('Un client est connecté');
  socket.on('disconnect', () => {
    console.log('Un client est déconnecté');
  });
});




// 1) GLOBAL MIDDLEWARES
// Sécurité des en-têtes HTTP
app.use(helmet());

// Journalisation des requêtes en développement
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limiter les requêtes pour prévenir les attaques par force brute
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 1 heure
  message: 'Trop de requêtes depuis cette adresse IP, veuillez réessayer dans une heure!'
});
app.use('/api', limiter);

// Parser du corps des requêtes avec une limite de taille
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Nettoyage des données contre les attaques NoSQL injection
app.use(mongoSanitize());

// Protection contre les attaques XSS
app.use(xss());

// Protection contre la pollution des paramètres HTTP
app.use(hpp({
  whitelist: [
    'duration',
    'ratingsQuantity',
    'ratingsAverage',
    'maxGroupSize',
    'difficulty',
    'price'
  ]
}));

// Configuration CORS
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CLIENT_URL 
    : 'http://localhost:3000',
  credentials: true
};
app.use(cors(corsOptions));

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// 2) ROUTES
app.get('/', (req, res) => {
  res.json({ 
    status: 'success',
    message: 'Bienvenue sur l\'API du restaurant Kolya',
    documentation: `${req.protocol}://${req.get('host')}/api-docs`
  });
});

// Importation des routes
const authRoutes = require('./routes/auth');
const dishRoutes = require('./routes/dishes');

// Montage des routeurs
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/dishes', dishRoutes);

// Gestion des routes non trouvées
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Impossible de trouver ${req.originalUrl} sur ce serveur!`
  });});

// Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Configuration du port
const PORT = process.env.PORT || 5000;

// Connexion à MongoDB et démarrage du serveur
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    
    console.log('✅ Connecté à MongoDB avec succès'.green.bold);
    
    const server = app.listen(PORT, () => {
      console.log(`🚀 Serveur en cours d'exécution sur le port ${PORT}`.blue.bold);
      console.log(`Mode: ${process.env.NODE_ENV || 'development'}`.yellow);
    });

    // Gestion des erreurs non capturées
    process.on('unhandledRejection', (err) => {
      console.error('UNHANDLED REJECTION! 💥 Arrêt...'.red.bold);
      console.error(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });

    // Gestion des erreurs non gérées
    process.on('uncaughtException', (err) => {
      console.error('UNCAUGHT EXCEPTION! 💥 Arrêt...'.red.bold);
      console.error(err.name, err.message);
      process.exit(1);
    });

    // Gestion du signal SIGTERM (pour les déploiements avec arrêt propre)
    process.on('SIGTERM', () => {
      console.log('👋 SIGTERM REÇU. Arrêt en cours...'.yellow.bold);
      server.close(() => {
        console.log('💥 Processus arrêté'.red.bold);
      });
    });

  } catch (err) {
    console.error('Échec de la connexion à la base de données!'.red.bold);
    console.error(err);
    process.exit(1);
  }
};

// Démarrer le serveur
startServer();

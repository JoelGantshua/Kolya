const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Charger les variables d'environnement
dotenv.config({ path: './config/config.env' });

// Se connecter à la base de données
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connecté: ${conn.connection.host}`.cyan.underline.bold);
  } catch (err) {
    console.error(`Erreur: ${err.message}`.red);
    process.exit(1);
  }
};

// Créer un administrateur
const createAdmin = async () => {
  try {
    // Vérifier si un administrateur existe déjà
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (adminExists) {
      console.log('Un administrateur existe déjà'.yellow);
      process.exit(0);
    }

    // Créer un nouvel administrateur
    const admin = await User.create({
      name: 'Administrateur',
      email: 'admin@kolya.com',
      password: 'Admin123!', // À changer après la première connexion
      role: 'admin',
      isEmailVerified: true
    });

    console.log(`✅ Administrateur créé avec succès`.green.bold);
    console.log(`Email: ${admin.email}`.cyan);
    console.log(`Mot de passe: Admin123!`.cyan);
    console.log('\n⚠️  IMPORTANT: Changez ce mot de passe après votre première connexion!'.yellow.bold);
    
    process.exit();
  } catch (err) {
    console.error(`Erreur: ${err.message}`.red);
    process.exit(1);
  }
};

// Exécuter le script
connectDB().then(createAdmin);

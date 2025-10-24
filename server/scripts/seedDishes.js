const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Charger les variables d'environnement
dotenv.config({ path: './config/config.env' });

// Importer le modèle Dish
const Dish = require('../models/Dish');

// Importer les données de test
const dishes = require('../data/dishes');

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

// Importer les données dans la base de données
const importData = async () => {
  try {
    // Supprimer tous les plats existants
    await Dish.deleteMany();
    console.log('Anciens plats supprimés'.red.inverse);

    // Créer les dossiers pour les images si nécessaire
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('Dossier uploads créé');
    }

    // Copier les images de démonstration (à remplacer par vos propres images)
    const demoImagesDir = path.join(process.cwd(), 'public', 'images');
    if (fs.existsSync(demoImagesDir)) {
      const files = fs.readdirSync(demoImagesDir);
      for (const file of files) {
        if (file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')) {
          const sourcePath = path.join(demoImagesDir, file);
          const destPath = path.join(uploadsDir, file);
          
          if (!fs.existsSync(destPath)) {
            fs.copyFileSync(sourcePath, destPath);
            console.log(`Image copiée: ${file}`);
          }
        }
      }
    }

    // Ajouter les plats
    const createdDishes = await Dish.create(dishes);
    console.log(`${createdDishes.length} plats ajoutés`.green.inverse);

    process.exit();
  } catch (err) {
    console.error(`Erreur: ${err.message}`.red);
    process.exit(1);
  }
};

// Exécuter la fonction d'importation
connectDB().then(importData);

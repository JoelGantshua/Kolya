import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Charger les variables d'environnement
dotenv.config({ path: './config/config.env' });

// Charger les modèles
import Dish from '../models/Dish.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Gallery from '../models/Gallery.js';
import Reservation from '../models/Reservation.js';

// Se connecter à la base de données
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Lire les fichiers JSON
const dishes = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'dishes.json'), 'utf-8'));
const users = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'users.json'), 'utf-8'));

// Importer dans la base de données
const importData = async () => {
  try {
    await Dish.create(dishes);
    await User.create(users);
    
    console.log('Données importées avec succès'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Supprimer les données
const deleteData = async () => {
  try {
    await Dish.deleteMany();
    await User.deleteMany();
    await Order.deleteMany();
    await Gallery.deleteMany();
    await Reservation.deleteMany();
    
    console.log('Données supprimées avec succès'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
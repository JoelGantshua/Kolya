const mongoose = require('mongoose');

const DishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Veuillez ajouter un nom de plat'],
    trim: true,
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
  },
  description: {
    type: String,
    required: [true, 'Veuillez ajouter une description'],
    maxlength: [500, 'La description ne peut pas dépasser 500 caractères']
  },
  price: {
    type: Number,
    required: [true, 'Veuillez ajouter un prix'],
    min: [0, 'Le prix doit être supérieur à 0']
  },
  category: {
    type: String,
    required: [true, 'Veuillez sélectionner une catégorie'],
    enum: [
      'entrées',
      'plats',
      'desserts',
      'boissons',
      'menus',
      'spécialités'
    ]
  },
  isVegetarian: {
    type: Boolean,
    default: false
  },
  isSpicy: {
    type: Boolean,
    default: false
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  image: {
    type: String,
    default: 'no-photo.jpg'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model('Dish', DishSchema);

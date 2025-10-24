// controllers/dishes.js
const Dish = require('../models/Dish');
const asyncHandler = require('express-async-handler');

// @desc    Récupérer tous les plats
exports.getDishes = asyncHandler(async (req, res) => {
  const dishes = await Dish.find();
  res.status(200).json({ success: true, count: dishes.length, data: dishes });
});

// @desc    Récupérer un plat par ID
exports.getDish = asyncHandler(async (req, res) => {
  const dish = await Dish.findById(req.params.id);
  if (!dish) return res.status(404).json({ success: false, error: 'Plat non trouvé' });
  res.status(200).json({ success: true, data: dish });
});

// @desc    Créer un plat
exports.createDish = asyncHandler(async (req, res) => {
  const dish = await Dish.create(req.body);
  res.status(201).json({ success: true, data: dish });
});

// @desc    Mettre à jour un plat
exports.updateDish = asyncHandler(async (req, res) => {
  const dish = await Dish.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!dish) return res.status(404).json({ success: false, error: 'Plat non trouvé' });
  res.status(200).json({ success: true, data: dish });
});


// @desc    Supprimer un plat
exports.deleteDish = asyncHandler(async (req, res) => {
  const dish = await Dish.findByIdAndDelete(req.params.id);
  if (!dish) return res.status(404).json({ success: false, error: 'Plat non trouvé' });
  res.status(200).json({ success: true, message: 'Plat supprimé' });
});

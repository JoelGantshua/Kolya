const Dish = require('../models/Dish');

// @desc    Récupérer tous les plats
// @route   GET /api/v1/dishes
// @access  Public
exports.getDishes = async (req, res, next) => {
  try {
    const dishes = await Dish.find();
    res.status(200).json({
      success: true,
      count: dishes.length,
      data: dishes
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Récupérer un seul plat
// @route   GET /api/v1/dishes/:id
// @access  Public
exports.getDish = async (req, res, next) => {
  try {
    const dish = await Dish.findById(req.params.id);
    
    if (!dish) {
      return res.status(404).json({
        success: false,
        error: 'Plat non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: dish
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Créer un plat
// @route   POST /api/v1/dishes
// @access  Privé/Admin
exports.createDish = async (req, res, next) => {
  try {
    const dish = await Dish.create(req.body);
    
    res.status(201).json({
      success: true,
      data: dish
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Mettre à jour un plat
// @route   PUT /api/v1/dishes/:id
// @access  Privé/Admin
exports.updateDish = async (req, res, next) => {
  try {
    const dish = await Dish.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!dish) {
      return res.status(404).json({
        success: false,
        error: 'Plat non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: dish
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Supprimer un plat
// @route   DELETE /api/v1/dishes/:id
// @access  Privé/Admin
exports.deleteDish = async (req, res, next) => {
  try {
    const dish = await Dish.findByIdAndDelete(req.params.id);

    if (!dish) {
      return res.status(404).json({
        success: false,
        error: 'Plat non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

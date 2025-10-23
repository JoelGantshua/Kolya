const express = require('express');
const router = express.Router();
const {
  getDishes,
  getDish,
  createDish,
  updateDish,
  deleteDish
} = require('../controllers/dishes');

const { protect, authorize } = require('../middleware/auth');

// Routes publiques
router.route('/')
  .get(getDishes);

router.route('/:id')
  .get(getDish);

// Routes protégées (admin uniquement)
router.use(protect, authorize('admin'));

router.route('/')
  .post(createDish);

router.route('/:id')
  .put(updateDish)
  .delete(deleteDish);

module.exports = router;

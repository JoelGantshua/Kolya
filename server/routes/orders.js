const express = require('express');
const { 
  createOrder, 
  getOrders, 
  updateOrderStatus 
} = require('../controllers/orders');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Routes publiques
router.post('/', createOrder);

// Routes protégées (admin)
router.use(protect, authorize('admin'));
router.get('/', getOrders);
router.put('/:id', updateOrderStatus);

module.exports = router;
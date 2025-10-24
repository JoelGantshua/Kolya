const express = require('express');
const router = express.Router();
const { createReservation, getReservations, updateReservationStatus } = require('../controllers/reservations');
const { protect, authorize } = require('../middleware/auth');

// Routes publiques
router.post('/', createReservation);

// Routes admin (protégées)
router.use(protect, authorize('admin'));
router.get('/', getReservations);
router.put('/:id', updateReservationStatus);

module.exports = router;

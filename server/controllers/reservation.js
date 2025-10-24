// controllers/reservationController.js
const Reservation = require('../models/Reservation');

// Créer une réservation
exports.createReservation = async (req, res) => {
  try {
    const reservation = await Reservation.create(req.body);
    res.status(201).json({ success: true, data: reservation });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Obtenir toutes les réservations (pour le tableau de bord)
exports.getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ date: -1 });
    res.status(200).json({ success: true, count: reservations.length, data: reservations });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Mettre à jour le statut d'une réservation
exports.updateReservationStatus = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    res.status(200).json({ success: true, data: reservation });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
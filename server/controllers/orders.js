const Order = require('../models/Order');
const asyncHandler = require('express-async-handler');

// @desc    Créer une commande
exports.createOrder = asyncHandler(async (req, res) => {
  const order = await Order.create(req.body);
  req.app.get('io').emit('newOrder', order);
  res.status(201).json({ success: true, data: order });
});

// @desc    Récupérer toutes les commandes
exports.getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().sort('-createdAt');
  res.status(200).json({ success: true, count: orders.length, data: orders });
});

// @desc    Mettre à jour le statut d'une commande
exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );
  if (!order) return res.status(404).json({ success: false, error: 'Commande non trouvée' });
  req.app.get('io').emit('orderUpdated', order);
  res.status(200).json({ success: true, data: order });
});
const express = require('express');
const { 
  uploadImage, 
  getGallery, 
  deleteImage 
} = require('../controllers/gallery');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Routes publiques
router.get('/', getGallery);

// Routes protégées (admin)
router.use(protect, authorize('admin'));
router.post('/upload', uploadImage);
router.delete('/:id', deleteImage);

module.exports = router;
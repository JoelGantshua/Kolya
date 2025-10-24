const path = require('path');
const fs = require('fs');
const Gallery = require('../models/Gallery');
const asyncHandler = require('express-async-handler');

// Configuration de Multer pour le téléchargement d'images
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'public/uploads/gallery';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `gallery-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Seules les images sont autorisées'));
  }
}).single('image');

exports.uploadImage = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ success: false, error: err.message });
    if (!req.file) return res.status(400).json({ success: false, error: 'Aucun fichier téléchargé' });
    
    try {
      const image = await Gallery.create({
        image: `/uploads/gallery/${req.file.filename}`,
        title: req.body.title,
        description: req.body.description,
        category: req.body.category
      });
      res.status(201).json({ success: true, data: image });
    } catch (error) {
      // Supprimer le fichier en cas d'erreur
      fs.unlinkSync(req.file.path);
      res.status(400).json({ success: false, error: error.message });
    }
  });
};

// @desc    Récupérer toutes les images
exports.getGallery = asyncHandler(async (req, res) => {
  const gallery = await Gallery.find().sort('-createdAt');
  res.status(200).json({ success: true, count: gallery.length, data: gallery });
});

// @desc    Supprimer une image
exports.deleteImage = asyncHandler(async (req, res) => {
  const image = await Gallery.findById(req.params.id);
  if (!image) return res.status(404).json({ success: false, error: 'Image non trouvée' });

  // Supprimer le fichier
  const imagePath = path.join(__dirname, '../public', image.image);
  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
  }

  await image.remove();
  res.status(200).json({ success: true, data: {} });
});
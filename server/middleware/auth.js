const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// Protéger les routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      error: 'Non autorisé, token manquant' 
    });
  }

  try {
    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return res.status(401).json({ 
      success: false, 
      error: 'Non autorisé, token invalide' 
    });
  }
});

// Autoriser des rôles spécifiques
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        error: `Le rôle ${req.user.role} n'est pas autorisé à accéder à cette ressource` 
      });
    }
    next();
  };
};
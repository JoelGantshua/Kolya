const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
  
    // Log pour le développement
    console.error(err.stack.red);
  
    // Erreur de validation Mongoose
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors).map(val => val.message);
      error = new Error(message);
      error.statusCode = 400;
    }
  
    // Erreur de doublon de clé
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      const message = `Cette valeur existe déjà pour le champ ${field}`;
      error = new Error(message);
      error.statusCode = 400;
    }
  
    // Erreur de format d'ID
    if (err.name === 'CastError') {
      const message = `Ressource non trouvée avec l'ID ${err.value}`;
      error = new Error(message);
      error.statusCode = 404;
    }
  
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Erreur serveur'
    });
  };
  
  module.exports = errorHandler;
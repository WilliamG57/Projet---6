const multer = require ("multer"); //Package pour gérer les fichiers entrant dans les requetes HTTP

// Dictionnaire extensions images
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
  };

  const storage = multer.diskStorage({
    // Destination images
    destination: (req, file, callback) => {
        callback(null, "images");
    },
    // Nouveau nom pour éviter les doublons
    filename: (req, file, callback) => {
        const name = file.originalname.split(" ").join("_"); //Remplacement des espaces par des underscore
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + "." + extension); //Nom d'origine + numéro + . + extension
    }
  });

  module.exports = multer({ storage: storage}).single("image");
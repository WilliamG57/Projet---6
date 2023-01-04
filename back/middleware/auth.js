// Récupère le package
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // Récupération token
        const token = req.headers.authorization.split(' ')[1];
        // Vérification
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        // Récupération Id
        const userId = decodedToken.userId;
        // Comparaison avec le token
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User id non valable !';
        } else {
            next();
        }
        } catch(error){
            res.status(401).json({ error: new Error('Requête non authentifiée !')});
        }
};

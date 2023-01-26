const jwt = require('jsonwebtoken') //On récupère le package

//On vérifie que l'user de la requète correspond bien à celui du Token, il sera alors autorisé à modifier les données
module.exports = (req, res, next) => {
    try {
        // Récupération du token
        const token = req.headers.authorization.split(' ')[1]
        // Décodage pour vérifier que le user de la requète correspond bien au token
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET')
         // Récupération du userId encodé à l'interieur
        req.auth = {
            userId: decodedToken.userId
        }
        next()
    }
    catch (error) {
        res.status(401).json({error})
    }
}

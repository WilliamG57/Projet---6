const express = require("express"); //Importation d'express
const mongoose = require("mongoose"); //Pour ce connecter à MongoBd
const bodyParser = require("body-parser"); //Pouvoir extraire l'objet JSON des requêtes post
const sauceRoutes = require("./routes/sauce"); //On importe la route des sauces
const userRoutes= require ("./routes/user"); //On importe la route pour les utilisateurs
const helmet = require("helmet"); //Module de sécurité pour protger l'application
const mongoSanitize = require('express-mongo-sanitize');
const path = require("path"); // Gestion des images
const app = express(); //Utilisation du framework express pour l'application
const cors = require('cors')
require('dotenv').config() //Pour masquer les information de connection à MongoBd



// Connection à la base de donnée MongoBd
mongoose.set('strictQuery', false);
mongoose.connect(`mongodb+srv://${process.env.mongoUserName}:${process.env.mongoPassword}@cluster0.edjmd0v.mongodb.net/?retryWrites=true&w=majority`,
{ useNewUrlParser: true,
  useUnifiedTopology: true })

  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


// Passer outre certaine sécurité de CORS afin que tout le monde puisse ce connecter de son navigateur
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    next();
});

app.use(bodyParser.json());
app.use(mongoSanitize());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);
app.use('/images', express.static(path.join(__dirname, 'images'))); // gestion images de manière statiques


//Export de l'app express pour déclaration dans server.js
module.exports = app;
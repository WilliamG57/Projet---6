const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const sauceRoutes = require("./routes/sauce");
const userRoutes= require ("./routes/user");
const helmet = require("helmet");
const mongoSanitize = require('express-mongo-sanitize');
const path = require("path");
const app = express();

// Mongoose connect
mongoose.connect('mongodb+srv://william:gd9XhkpZ5lI9STjb@cluster0.edjmd0v.mongodb.net/?retryWrites=true&w=majority',
{ useNewUrlParser: true,
  useUnifiedTopology: true })

  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

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

// gestion images de manière statiques
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;
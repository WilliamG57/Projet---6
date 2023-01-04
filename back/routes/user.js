const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit'); // package de prévention
const userCtrl = require('../controllers/user');
const checkPassword = require('../middleware/password-validator');

const passLimiter = rateLimit({
    windowMs: 2 * 60 * 1000, // Temps de test
    max: 3 // Nombre d'essai
});

router.post('/signup',checkPassword, userCtrl.signup);
router.post('/login',passLimiter, userCtrl.login);

module.exports = router;
const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

// ROUTING
const router = express.Router();

router.post('/sign-up', authController.signup);

module.exports = router;

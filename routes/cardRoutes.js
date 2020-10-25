const express = require('express');
const cardController = require('../controllers/cardController');
const authController = require('../controllers/authController');

// ROUTING
const router = express.Router();

router
  .route('/')
  .get(cardController.getAllCards)
  .post(cardController.createCard);

module.exports = router;

const express = require('express');
const cardController = require('../controllers/cardController');
const authController = require('../controllers/authController');

const router = express.Router();

// Registered Users only
router.use(authController.protect);
router
  .route('/')
  // admins only
  .get(authController.restrictTo('admin'), cardController.getAllCards)
  .post(cardController.createCard);

router
  .route('/:id')
  .get(cardController.getCard)
  .patch(cardController.updateCard)
  .delete(cardController.deleteCard);

module.exports = router;

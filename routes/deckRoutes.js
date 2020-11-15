const express = require('express');
const deckController = require('../controllers/deckController');
const authController = require('../controllers/authController');

const router = express.Router();

// Everything is for registered users only
router.use(authController.protect);
router
  .route('/')
  // admins only
  .get(authController.restrictTo('admin'), deckController.getAllDecks)
  .post(deckController.createDeck);

router
  .route('/:id')
  .get(deckController.getDeck)
  .patch(deckController.updateDeck)
  .delete(deckController.deleteDeck);

module.exports = router;

const Deck = require('../models/deckModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.getAllDecks = factory.getAll(Deck);

exports.getDeck = factory.getOne(Deck);
exports.createDeck = factory.createOne(Deck);
exports.updateDeck = factory.updateOne(Deck);
exports.deleteDeck = factory.deleteOne(Deck);

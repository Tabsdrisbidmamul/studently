const Card = require('../models/cardModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.getAllCards = factory.getAll(Card);

exports.createCard = factory.createOne(Card);

const User = require('../models/userModel');
const Card = require('../models/cardModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.getAllUsers = factory.getAll(User);
// exports.deleteUser = factory.deleteOne(User);

// admin only
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

exports.getMyCards = catchAsync(async (req, res, next) => {
  // 1. Find all cards to that user id
  const cards = await Card.find({ user: req.user.id });

  res.status(200).json({
    status: 'success',
    results: cards.length,
    data: {
      cards,
    },
  });
});

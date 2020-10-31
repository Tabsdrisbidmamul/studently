const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'A card must have a question'],
      minlength: [5, 'A card must have more than 5 characters'],
      maxlength: [300, 'A card cannot have more than 200 characters'],
      unique: true,
    },

    answer: {
      type: String,
      required: [true, 'A card must have an answer'],
      minlength: [5, 'A card must have more than 5 characters'],
      maxlength: [300, 'A card cannot have more than 200 characters'],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A card must have a User'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// INDEXES

// Index on user field
cardSchema.index({ user: 1 });

// MIDDLEWARE

// Populate the user field when queried
cardSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name role photo',
  });

  next();
});

const Card = mongoose.model('Card', cardSchema);
module.exports = Card;

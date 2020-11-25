const mongoose = require('mongoose');

const deckSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A deck must have a name'],
      minlength: [5, 'A deck must have at least 5 characters'],
      maxlength: [100, 'A deck must have at most 100 characters'],
      lowercase: true,
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },

    cards: {
      type: [
        {
          type: mongoose.Schema.ObjectId,
          ref: 'Card',
        },
      ],
      required: [true, 'A deck must have cards'],
      validate: [
        function (val) {
          return val.length >= 1 && val.length <= 10;
        },
        'A deck must have at at least 1 card and no more than 10 cards',
      ],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// INDEXES
deckSchema.index({ name: 1, user: 1 }, { unique: true });

// MIDDLEWARE

// populate the cards when queried
deckSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'cards',
  });
  next();
});

const Deck = mongoose.model('Deck', deckSchema);
module.exports = Deck;

const mongoose = require('mongoose');

const deckSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A deck must have a name'],
      unique: true,
      minlength: [5, 'A deck must have at least 5 characters'],
      maxlength: [100, 'A deck must have at most 100 characters'],
    },

    user: {
      type: mongoose.Schema.toObject,
      ref: 'User',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

deckSchema.virtual('cards', {
  ref: 'Card',
  foreignField: 'deck',
  localField: '_id',
});

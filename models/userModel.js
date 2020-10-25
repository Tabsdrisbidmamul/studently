const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'You must have a name'],
      minlength: [5, 'A name must have more than 5 characters'],
      maxlength: [30, 'A name cannot have more than 30 characters'],
    },

    email: {
      type: String,
      required: [true, 'You must have an email'],
      maxlength: [50, 'The email entered is too long'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Your email is not valid'],
    },

    role: {
      type: String,
      enum: ['student', 'parent', 'teacher'],
      default: 'student',
    },

    photo: {
      type: String,
      default: 'default.jpg',
    },

    password: {
      type: String,
      required: [true, 'You must give a password'],
      minlength: [
        8,
        'Your password is too short, you must enter more than 8 characters',
      ],
      validate: [
        function (val) {
          const regex = RegExp('^[-\\w@!$£%^&*+]+$');
          return regex.test(val);
        },
        'Non-special characters are not allowed, please use a mix of letters and numbers',
      ],
      select: false,
    },

    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      minlength: [
        8,
        'Your password is too short, you must enter more than 8 characters',
      ],
      validate: [
        function (val) {
          return val === this.password;
        },
        'Password do not match',
      ],
      select: false,
    },

    active: {
      type: Boolean,
      default: true,
      select: false,
    },

    // Field is only given to a user when they have changed their password, if not this field will not exist in the user document
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// SCHEMA MIDDLEWARE

// hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  // hash and salt password with cost of 12
  this.password = await bcryptjs.hash(this.password, 12);

  // delete passwordConfirm field
  this.passwordConfirm = undefined;

  next();
});

// create timestamp for a changed password
userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();

  // Subtract 1000ms for error margins
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Retrieve only active users
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: true } });
  next();
});

// INSTANCE METHODS

// Password checker
userSchema.methods.correctPassword = async function (
  inputPassword,
  userPassword
) {
  return await bcryptjs.compare(inputPassword, userPassword);
};

// Check if the password has been modified
userSchema.methods.modifiedPassword = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    // Password HAS been changed
    return JWTTimestamp < changedTimeStamp;
  }
  // Password has NOT been changed
  return false;
};

// Set the passwordResetToken
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;

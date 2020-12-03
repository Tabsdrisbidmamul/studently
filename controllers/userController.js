const multer = require('multer');
const sharp = require('sharp');

const User = require('../models/userModel');
const Card = require('../models/cardModel');
const Deck = require('../models/deckModel');
const Classroom = require('../models/classroomModel');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const filterObj = require('../utils/filterObj');

// add user id to parameter list
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

// Save the image in memory buffer and not on disk
const multerStorage = multer.memoryStorage();

/**
 * Muller Filter
 * To only filter out files that you want, in this case in the mime field it will say what content the file is, and in this case we want only images, so we can test for image at the beginning of the string of the mim attr
 *
 * If not we can pass an error to it to say that the file is not an image
 */
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  // File is in buffer, so we can access it directly, then making a call to disk
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password updates. ', 400));
  }

  // 2) Filter out unwanted field names
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;

  // 3) Update the user document
  const user = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

// admin only
exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

// Registered Users Only
exports.getMyCards = factory.getAll(Card, 'user');
exports.getMyDecks = factory.getAll(Deck, 'user');
exports.getTeacherClassrooms = factory.getAll(Classroom, 'teacher');
exports.getStudentClassrooms = factory.getAll(Classroom, 'student');

// Teachers and Admins only
exports.getAllStudents = factory.getAll(User, { role: 'student' });

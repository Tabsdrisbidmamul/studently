const User = require('../models/userModel');
const Card = require('../models/cardModel');
const Deck = require('../models/deckModel');
const Classroom = require('../models/classroomModel');
const factory = require('./handlerFactory');

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

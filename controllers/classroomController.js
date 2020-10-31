const Classroom = require('../models/classroomModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// Teachers and Admins only
exports.getAllClassrooms = factory.getAll(Classroom);

exports.getClassroom = factory.getOne(Classroom);
exports.createClassroom = factory.createOne(Classroom);
exports.updateClassroom = factory.updateOne(Classroom);
exports.deleteClassroom = factory.deleteOne(Classroom);

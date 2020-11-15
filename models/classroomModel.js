const mongoose = require('mongoose');

const classroomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [5, 'A classroom must have more than 5 characters'],
      maxlength: [30, 'A classroom must have less than 30 characters'],
      required: [true, 'A classroom must have a name'],
    },

    teacher: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A classroom must have a teacher'],
    },

    students: {
      type: [
        {
          type: mongoose.Schema.ObjectId,
          ref: 'User',
        },
      ],
      required: [true, 'A classroom must have students'],
      validate: [
        function (val) {
          return val.length >= 1 && val.length <= 10;
        },
        'A classroom can have between 1 and 10 students',
      ],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

classroomSchema.index({ name: 1, teacher: 1 }, { unique: true });

// MIDDLEWARE
classroomSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'teacher',
    select: 'name email role photo',
  }).populate({
    path: 'students',
    select: 'name email role photo',
  });

  next();
});

const Classroom = mongoose.model('Classroom', classroomSchema);
module.exports = Classroom;

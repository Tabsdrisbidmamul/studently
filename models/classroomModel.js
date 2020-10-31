const mongoose = require('mongoose');

const classroomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      minlength: [5, 'A classroom must have more than 5 characters'],
      maxlength: [30, 'A classroom must have less than 30 characters'],
      required: [true, 'A classroom must have a name'],
    },

    teacher: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A classroom must have a teacher'],
    },

    // teacher: {
    //   type: {
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'User',
    //   },
    //   required: [true, 'A classroom must have a teacher'],
    //   validate: [
    //     function (val) {
    //       return val.role === 'teacher';
    //     },
    //     'You are not a teacher',
    //   ],
    // },

    // students: [
    //   {
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'User',
    //     required: [true, 'A classroom must have students'],
    //     validate: [
    //       function (val) {
    //         return val >= 1 && val <= 10;
    //       },
    //       'A classroom can have between 1 and 10 students',
    //     ],
    //   },
    // ],

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

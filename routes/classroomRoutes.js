const express = require('express');
const classroomController = require('../controllers/classroomController');
const authController = require('../controllers/authController');

const router = express.Router();

// Everything is for registered users only
router.use(authController.protect);

// admins and teachers only
router
  .route('/')
  .get(
    authController.restrictTo('admin', 'teacher'),
    classroomController.getAllClassrooms
  )
  .post(
    authController.restrictTo('admin', 'teacher'),
    classroomController.createClassroom
  );

router.use(authController.restrictTo('admin', 'teacher'));
router
  .route('/:id')
  .get(classroomController.getClassroom)
  .patch(classroomController.updateClassroom)
  .delete(classroomController.deleteClassroom);

module.exports = router;

const express = require('express');
const classroomController = require('../controllers/classroomController');
const authController = require('../controllers/authController');

// ROUTING
const router = express.Router();

// router.use(authController.protect);

router
  .route('/')
  .get(classroomController.getAllClassrooms)
  .post(classroomController.createClassroom);

router
  .route('/:id')
  .get(classroomController.getClassroom)
  .patch(classroomController.updateClassroom)
  .delete(classroomController.deleteClassroom);

module.exports = router;

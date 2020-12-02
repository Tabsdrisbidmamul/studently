const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

// for everyone
router.post('/sign-up', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Everything below this is for registered users only
router.use(authController.protect);

router.get('/my-account', userController.getMe, userController.getUser);
router.get('/my-cards', userController.getMyCards);
router.get('/my-decks', userController.getMyDecks);
router.get(
  '/students',
  authController.restrictTo('admin', 'teacher'),
  userController.getAllStudents
);
router.get(
  '/teacher-classrooms',
  authController.restrictTo('admin', 'teacher'),
  userController.getTeacherClassrooms
);
router.get(
  '/student-classrooms',
  authController.restrictTo('admin', 'student'),
  userController.getStudentClassrooms
);

// Everything below this point is for admins and teachers only
router
  .route('/')
  .get(authController.restrictTo('admin'), userController.getAllUsers);

// everything below this point is for admins only
router.use(authController.restrictTo('admin'));

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;

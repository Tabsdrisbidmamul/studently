const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiLike = require('chai-like');
const chaiThings = require('chai-things');

const cardTest = require('./cardTest');
const userTest = require('./userTest');

chai.use(chaiHttp);
chai.use(chaiLike);
chai.use(chaiThings);

// signup credentials for test new users
exports.newStudent = {
  name: 'Student',
  email: 'student2@example.com',
  password: 'test1234',
  passwordConfirm: 'test1234',
  role: 'student',
};

exports.newTeacher = {
  name: 'Teacher',
  email: 'teacher2@example.com',
  password: 'test1234',
  passwordConfirm: 'test1234',
  role: 'teacher',
};

exports.newAdmin = {
  name: 'Admin',
  email: 'admin2@example.com',
  password: 'test1234',
  passwordConfirm: 'test1234',
  role: 'admin',
};

// Login credentials for test users
exports.loginStudent = {
  email: 'student2@example.com',
  password: 'test1234',
};

exports.loginTeacher = {
  email: 'teacher2@example.com',
  password: 'test1234',
};

exports.loginAdmin = {
  email: 'admin2@example.com',
  password: 'test1234',
};

cardTest();
userTest();

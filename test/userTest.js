const mongoose = require('mongoose');

const chai = require('chai');
const should = require('chai').should();
const chaiHttp = require('chai-http');
// const { expect } = require('chai');
const chaiLike = require('chai-like');
const chaiThings = require('chai-things');

const server = require('../server');
const User = require('../models/userModel');

module.exports = () => {
  describe('Users', () => {
    // beforeEach('Create a new user in the API', (done) => {
    //   chai
    //     .request(server)
    //     .post('/api/v0/users/sign-up')
    //     .send(student)
    //     .end((err, res) => {
    //       res.should.have.status(201);
    //       res.body.should.have.property('token');
    //       done();
    //     });
    // });

    describe('/GET all users', () => {
      beforeEach('Create a new student in the API', (done) => {
        chai
          .request(server)
          .post('/api/v0/users/sign-up')
          .send(newStudent)
          .end((err, res) => {
            res.body.should.have.property('token');
            res.should.have.status(201);
            done();
          });
      });

      beforeEach('Create a new teacher in the API', (done) => {
        chai
          .request(server)
          .post('/api/v0/users/sign-up')
          .send(newTeacher)
          .end((err, res) => {
            res.body.should.have.property('token');
            res.should.have.status(201);
            done();
          });
      });

      beforeEach('Create a new Admin in the API', (done) => {
        chai
          .request(server)
          .post('/api/v0/users/sign-up')
          .send(newTeacher)
          .end((err, res) => {
            token = res.body.token;
            res.body.should.have.property('token');
            res.should.have.status(201);
            done();
          });
      });

      it('it should GET all the users that have been created', (done) => {
        chai
          .request(server)
          .get('api/v0/users')
          .set({ Authorization: `Bearer ${token}` })
          .end((err, res) => {
            res.should.have.status(200);
            res.should.have.property('results');
            res.should.have.property('data');
            res.body.should.have.nested.property('data.user');
            done();
          });
      });
    });

    describe('/GET my-cards', () => {
      beforeEach('Log the newly created user in', (done) => {
        chai
          .request(server)
          .post('/api/v0/users/login')
          .send(loginStudent)
          .end((err, res) => {
            token = res.body.token;
            res.body.should.have.property('token');
            res.should.have.status(200);
            done();
          });
      });

      // afterEach('Truncate the DB after each test', (done) => {
      //   User.remove({}, (err) => {
      //     done();
      //   });
      // });

      it('it should GET all the cards that the user created', (done) => {
        chai
          .request(server)
          .get('/api/v0/users/my-cards')
          .set({ Authorization: `Bearer ${token}` })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('results');
            res.body.should.have.property('data');

            const { cards } = res.body.data;
            cards.forEach((item) => {
              item.should.have.property('question');
              item.should.have.property('answer');
              item.should.have.property('user');
              item.should.have.property('_id');
            });

            done();
          });
      });
    });
  });
};

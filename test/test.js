const mongoose = require('mongoose');

const chai = require('chai');
const should = require('chai').should();
const chaiHttp = require('chai-http');
const { expect } = require('chai');
const chaiLike = require('chai-like');
const chaiThings = require('chai-things');

const server = require('../server');
const Card = require('../models/cardModel');

// Testing the tests
// const addTwoNumbers = require('../addTwoNumbers');

// describe('addTwoNumbers', () => {
//   it('should add two numbers', () => {
//     // 1. Arrange
//     const x = 5;
//     const y = 1;

//     const sum1 = x + y;

//     // 2. Act
//     const sum2 = addTwoNumbers(x, y);

//     // 3. Assert
//     expect(sum2).to.be.equal(sum1);
//   });
// });

chai.use(chaiHttp);
chai.use(chaiLike);
chai.use(chaiThings);

describe('Cards', () => {
  // beforeEach((done) => {
  //   // before each test we empty the DB
  //   Card.remove({}, (err) => done());
  // });

  describe('/GET card', () => {
    it('It should GET all the cards', (done) => {
      chai
        .request(server)
        .get('/api/v0/cards')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status');
          res.body.should.have.property('results');
          res.body.should.have.property('data');
          res.body.should.have.nested.property('data.card');

          const card = res.body.data.card;
          card.should.be.a('array');

          card.forEach((item) => {
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

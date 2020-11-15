/* eslint-disable no-undef */
/* eslint-disable node/no-unpublished-require */

const mongoose = require('mongoose');

const chai = require('chai');
const should = require('chai').should();
const chaiHttp = require('chai-http');
// const { expect } = require('chai');
const chaiLike = require('chai-like');
const chaiThings = require('chai-things');

const server = require('../server');
const Card = require('../models/cardModel');
const User = require('../models/userModel');

const loginAdmin = require('./test');

module.exports = () => {
  describe('Cards', () => {
    describe('/GET cards', () => {
      beforeEach('Create the new admin user', (done) => {
        chai
          .request(server)
          .post('/api/v0/users/sign-up')
          .send(loginAdmin)
          .end((err, res) => {
            token = res.body.token;
            res.body.should.have.property('token');
            res.should.have.status(201);
            done();
          });
      });

      after('Delete the created admin user', async () => {
        await User.findOneAndDelete({
          email: 'admin2@example.com',
        });
      });

      it('It should GET all the cards', (done) => {
        chai
          .request(server)
          .get('/api/v0/cards')
          .set({ Authorization: `Bearer ${token}` })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('status');
            res.body.should.have.property('results');
            res.body.should.have.property('data');
            res.body.should.have.nested.property('data.card');

            const { card } = res.body.data;
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

    describe('/POST card', () => {
      before('Create test card 1', () => {
        card = {
          question: 'What is a Card?',
          answer: 'What is the answer?',
          user: '5f95d0b7466b4124bc99233a',
        };
      });

      after('Delete test card 1', async () => {
        await Card.findOneAndDelete({
          question: card.question,
          answer: card.answer,
        });
      });

      it('it should not POST a card with an answer field', (done) => {
        const card = {
          question: 'What is a Card?',
          user: '5f95d0b7466b4124bc99233a',
        };

        chai
          .request(server)
          .post('/api/v0/cards')
          .send(card)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('status');
            res.body.should.have.property('message');
            done();
          });
      });

      it('it should POST a card', (done) => {
        chai
          .request(server)
          .post('/api/v0/cards')
          .send(card)
          .end((err, res) => {
            res.should.have.status(201);
            res.body.should.be.a('object');
            done();
          });
      });
    });

    describe('/GET/:id card', () => {
      before('Create test card 2', async () => {
        card = new Card({
          question: 'What is a Card?',
          answer: 'What is an Answer?',
          user: '5f95d0b7466b4124bc99233a',
        });

        await Card.create(card);
      });

      after('Delete test card 2', async () => {
        await Card.findOneAndDelete({
          question: card.question,
          answer: card.answer,
        });
      });

      it('it should GET a card by the given id', (done) => {
        card.save((err, card) => {
          chai
            .request(server)
            .get(`/api/v0/cards/${card.id}`)
            .send(card)
            .end((err2, res) => {
              res.should.have.status(200);
              res.should.be.a('object');
              res.should.property('status');
              res.body.should.have.property('data');
              res.body.should.have.nested.property('data.card');

              const resCard = res.body.data.card;

              resCard.should.have.property('question');
              resCard.should.have.property('answer');
              resCard.should.have.property('user');
              resCard.should.have.property('_id');

              done();
            });
        });
      });
    });

    describe('/PUT/:id card', () => {
      before('Create test card 3', async () => {
        card = new Card({
          question: 'What is a Card?',
          answer: 'What is an Answer?',
          user: '5f95d0b7466b4124bc99233a',
        });

        await Card.create(card);
      });

      after('Delete test card 3', async () => {
        await Card.findOneAndDelete({
          question: 'What is a Card? (UPDATE)',
          answer: 'What is an Answer? (UPDATE)',
        });
      });

      it('it should UPDATE a book given the id', (done) => {
        chai
          .request(server)
          .patch(`/api/v0/cards/${card.id}`)
          .send({
            question: 'What is a Card? (UPDATE)',
            answer: 'What is an Answer? (UPDATE)',
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.should.property('status');
            res.body.should.have.property('data');
            res.body.should.have.nested.property('data.card');

            const resCard = res.body.data.card;

            resCard.should.have.property('question');
            resCard.should.have.property('answer');
            resCard.should.have.property('user');
            resCard.should.have.property('_id');
            done();
          });
      });
    });

    describe('/DELETE/:id card', () => {
      before('Create test card 4', async () => {
        card = new Card({
          question: 'What is a Card?',
          answer: 'What is an Answer?',
          user: '5f95d0b7466b4124bc99233a',
        });

        await Card.create(card);
      });

      it('it should DELETE a card given by id', (done) => {
        chai
          .request(server)
          .delete(`/api/v0/cards/${card.id}`)
          .end((err, res) => {
            res.should.have.status(204);
            res.body.should.be.a('object');
            res.should.property('status');
            res.body.should.be.empty;

            done();
          });
      });
    });
  });
};

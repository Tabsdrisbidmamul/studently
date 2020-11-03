const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiLike = require('chai-like');
const chaiThings = require('chai-things');

const cardTest = require('./cardTest');
const userTest = require('./userTest');

chai.use(chaiHttp);
chai.use(chaiLike);
chai.use(chaiThings);

cardTest();
userTest();

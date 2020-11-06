const express = require('express');
const path = require('path');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const userRouter = require('./routes/userRoutes');
const cardRouter = require('./routes/cardRoutes');
const deckRouter = require('./routes/deckRoutes');
const classroomRouter = require('./routes/classroomRoutes');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

const app = express();

// implement cors to allow anyone to consume API
app.use(
  cors({
    credentials: true,
  })
);

// SET Security HTTP headers
// app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", 'https:', 'http:', 'data:', 'ws:'],
      baseUri: ["'self'"],
      fontSrc: ["'self'", 'https:', 'http:', 'data:'],
      imgSrc: ["'self'", 'data'],
      scriptSrc: ["'self'", 'https:', 'http:', 'blob:'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https:', 'http:'],
    },
  })
);

// dev logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit number of requests from the same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

app.use('/api', limiter);

// body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// Data sanitization against NoSQL query injections
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Protect against request parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize, ',
      'difficulty',
      'price',
    ],
  })
);

// TO COMPRESS ALL INCOMING TEXT REQUEST AND COMPRESS THEM USING GZIP ETC.
app.use(compression());

// ALL ROUTES
app.use('/api/v0/users', userRouter);
app.use('/api/v0/cards', cardRouter);
app.use('/api/v0/decks', deckRouter);
app.use('/api/v0/classrooms', classroomRouter);

// UNHANDLED ROUTE ERROR MIDDLEWARE
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 400));
});

// GLOBAL ERROR HANDLER MIDDLEWARE: SIGNATURE (ERROR, REQ, RES, NEXT)
app.use(globalErrorHandler);

module.exports = app;

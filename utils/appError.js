// Taken from https://github.com/jonasschmedtmann/complete-node-bootcamp/blob/master/4-natours/after-section-14/utils/appError.js
// class usage has not change, but modification is in errorController to support error only for the API
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;

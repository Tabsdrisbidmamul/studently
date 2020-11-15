// taken from https://github.com/jonasschmedtmann/complete-node-bootcamp/blob/master/4-natours/after-section-14/utils/catchAsync.js
// Used in all the handlers to support catching errors in promises

// Lets us pass errors to our error handler that are for async callbacks

module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

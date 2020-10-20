// Lets us pass errors to our error handler that are for async callbacks

module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

const BadRequestError = require('../errors/BadRequestError');

const errorMessage = (err, req, res, next, msg) => {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    next(new BadRequestError(msg));
  } else {
    next(err);
  }
};

module.exports = { errorMessage };

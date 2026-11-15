const { ErrorConflict, BadRequestError } = require('../errors/allErrors');

const errorMessage = (err, req, res, next) => {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return next(new BadRequestError('Неверный запрос или данные'));
  }
  if (err.code === 11000) {
    return next(new ErrorConflict('Пользователь с таким email уже существует'));
  }
  return next(err);
};

module.exports = { errorMessage };

const { ErrorConflict, BadRequestError } = require('../errors/allErrors');

const errorMessage = (err, req, res, next) => {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    next(new BadRequestError('Неверный запрос или данные'));
  }
  if (err.code === 11000) {
    next(new ErrorConflict('Пользователь с таким email уже существует'));
  }
  next(err);
};

module.exports = { errorMessage };

const BadRequestError = require('../errors/BadRequestError');

const errorMessage = (err, req, res, next, msg) => {
  if (err.name === 'ValidationError') {
    next(new BadRequestError(msg));
  }
  next(err);
};
// if (err.name === 'CastError') {
//   res.status(BAD_REQUEST).send({
//     message: 'Переданы некорректные данные',
//   });

//   return;
// }
// if (err.name === 'DocumentNotFoundError') {
//   res.status(NOT_FOUND_STATUS).send({
//     message: 'Объект не найден',
//   });

//   return;
// }

// res.status(INTERNAL_SERVER_ERROR).send({
//   message: 'На сервере произошла ошибка',
// });

module.exports = { errorMessage };

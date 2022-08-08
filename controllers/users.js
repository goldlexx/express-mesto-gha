const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const BadRequestError = require('../errors/BadRequestError');
const ErrorNotFound = require('../errors/ErrorNotFound');
const ErrorConflict = require('../errors/ErrorConflict');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      throw new ErrorNotFound('Пользователь с таким ID - не найден');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CasrError') {
        next(new BadRequestError('Неверный запрос или данные'));
      } else {
        next(err);
      }
    });
};

module.exports.getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new ErrorNotFound('Пользователь не найден');
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Неверный запрос или данные'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => User.findOne({ _id: user._id }))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Неверный запрос или данные'));
      }
      if (err.code === 11000) {
        next(new ErrorConflict('Пользователь с таким email уже существует'));
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-alohomora', {
        expiresIn: '7d',
      });
      res.send({ jwt: token });
    })
    .catch(next);
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new ErrorNotFound('Пользователь с таким id не найден');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Неверный запрос или данные.'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      throw new ErrorNotFound('Пользователь с таким id не найден');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(
          new BadRequestError('Данные внесены некорректно или запрос неверный'),
        );
      } else {
        next(err);
      }
    });
};

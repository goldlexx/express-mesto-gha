const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const ErrorNotFound = require('./errors/ErrorNotFound');
const { auth } = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');
const { handleError } = require('./middlewares/handleError');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(
        /https?:\/\/(www\.)?[a-zA-Z\d\-.]{1,}\.[a-z]{1,6}([/a-z0-9\-._~:?#[\]@!$&'()*+,;=]*)/,
      ),
    }),
  }),
  createUser,
);

app.use(auth);

app.use('/users', require('./routes/user'));
app.use('/cards', require('./routes/card'));

app.use(errors());

app.use((req, res, next) => {
  next(new ErrorNotFound('Путь не найден'));
});

app.use(handleError);

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
  console.log('Connected to db');

  await app.listen(PORT);
  console.log(`App listening on port ${PORT}`);
}

main();

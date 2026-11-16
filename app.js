const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { celebrate, Joi, errors } = require('celebrate');
const { limiter } = require('./utils/limiter');
const { ErrorNotFound } = require('./errors/allErrors');
const { createUser, login } = require('./controllers/users');

const { auth } = require('./middlewares/auth');
const { handleError } = require('./middlewares/handleError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { PORT, DATABASE_URL } = require('./configuration');

const app = express();

app.use(requestLogger);
app.use(helmet());
app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().min(8).required(),
    }),
  }),
  login,
);

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().min(8).required(),
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

app.use(errorLogger);

app.use((req, res, next) => {
  next(new ErrorNotFound('Путь не найден'));
});

app.use(handleError);

async function main() {
  await mongoose.connect(DATABASE_URL);
  await new Promise((resolve, reject) => {
    const server = app.listen(PORT, () => {
      console.info(`App listening on port ${PORT}`);
      resolve();
    });
    server.once('error', reject);
  });
}

if (require.main === module) {
  main().catch(async (err) => {
    console.error('Failed to start the server:', err.message);
    await mongoose.disconnect().catch((disconnectError) => {
      console.error('Failed to disconnect from MongoDB after startup error:', disconnectError.message);
    });
    process.exitCode = 1;
  });
}

module.exports = app;

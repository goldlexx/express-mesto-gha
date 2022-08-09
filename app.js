const express = require('express');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const limiter = require('./utils/limiter');
const { ErrorNotFound } = require('./errors/allErrors');
const { auth } = require('./middlewares/auth');
const routes = require('./routes/routes');

const { handleError } = require('./middlewares/handleError');

const { PORT = 3000 } = process.env;
const app = express();

app.use(routes);
app.use(helmet());
app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

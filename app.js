const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { auth } = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');
const { NOT_FOUND_STATUS } = require('./utils/errorName');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/users', require('./routes/user'));
app.use('/cards', require('./routes/card'));

app.use((req, res) => {
  res.status(NOT_FOUND_STATUS).send({ message: 'Такой страницы не существует' });
});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
  console.log('Connected to db');

  await app.listen(PORT);
  console.log(`App listening on port ${PORT}`);
}

main();

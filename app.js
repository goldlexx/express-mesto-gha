const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '62dc1864288df5b962ba7568', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use('/users', require('./routes/user'));
app.use('/cards', require('./routes/card'));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
  console.log('Connected to db');

  await app.listen(PORT);
  console.log(`App listening on port ${PORT}`);
}

main();

require('dotenv').config();

const {
  PORT = 3000,
  DATABASE_URL = 'mongodb://127.0.0.1:27017/mestodb',
  JWT_SECRET,
} = process.env;

if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be set to a secret of at least 32 characters');
}

module.exports = { PORT, DATABASE_URL, JWT_SECRET };

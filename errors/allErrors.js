const { BadRequestError } = require('./BadRequestError');
const { ErrorConflict } = require('./ErrorConflict');
const { ErrorNotFound } = require('./ErrorNotFound');
const { Forbidden } = require('./Forbidden');
const { Unauthorized } = require('./Unauthorized');

module.exports = {
  BadRequestError,
  ErrorConflict,
  ErrorNotFound,
  Forbidden,
  Unauthorized,
};

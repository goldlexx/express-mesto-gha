const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // за 15 минут
  max: 1000, // allow up to 1,000 requests from one IP per window
});

module.exports = { limiter };

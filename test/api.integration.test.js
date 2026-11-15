require('dotenv').config();

const { test } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

process.env.JWT_SECRET = 'integration-tests-only-secret-value-over-32-chars';
if (process.env.MONGODB_TEST_URI) process.env.DATABASE_URL = process.env.MONGODB_TEST_URI;
const app = require('../app');
const User = require('../models/user');
const Card = require('../models/card');

const testToken = jwt.sign(
  { _id: new mongoose.Types.ObjectId().toString() },
  process.env.JWT_SECRET,
  { algorithm: 'HS256' },
);

function sendRequest(port, path, { method = 'GET', token, body } = {}) {
  return new Promise((resolve, reject) => {
    const payload = body === undefined ? undefined : JSON.stringify(body);
    const headers = {};
    if (payload) headers['Content-Type'] = 'application/json';
    if (payload) headers['Content-Length'] = Buffer.byteLength(payload);
    if (token) headers.Authorization = `Bearer ${token}`;
    const request = http.request({
      hostname: '127.0.0.1', port, path, method, headers,
    }, (response) => {
      let responseBody = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => { responseBody += chunk; });
      response.on('end', () => resolve({
        status: response.statusCode,
        body: responseBody ? JSON.parse(responseBody) : null,
      }));
    });
    request.on('error', reject);
    if (payload) request.write(payload);
    request.end();
  });
}

test('rejects invalid signup and card input before database access', async () => {
  const server = await new Promise((resolve) => {
    const instance = app.listen(0, () => resolve(instance));
  });
  try {
    const signup = await sendRequest(server.address().port, '/signup', {
      method: 'POST',
      body: { email: 'invalid@example.test', password: 'short' },
    });
    const card = await sendRequest(server.address().port, '/cards', {
      method: 'POST',
      token: testToken,
      body: { name: 'Place', link: 'not-a-url' },
    });
    assert.equal(signup.status, 400);
    assert.equal(card.status, 400);
  } finally {
    await new Promise((resolve) => {
      server.close(() => resolve());
    });
  }
});

test('Mongoose validates user and card URLs without a database', () => {
  const owner = new mongoose.Types.ObjectId();
  const user = new User({ email: 'test@example.test', password: 'password123', avatar: 'not-a-url' });
  const card = new Card({ name: 'Place', link: 'not-a-url', owner });
  assert.ok(user.validateSync().errors.avatar);
  assert.ok(card.validateSync().errors.link);
});

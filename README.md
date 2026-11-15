# Mesto API

An Express and MongoDB API for the Mesto photo-sharing application. It supports account registration and login, user profiles, photo cards, likes, and ownership checks.

## Stack

Node.js, Express, MongoDB, Mongoose, JWT, Celebrate/Joi.

## Configure and run

1. Install dependencies with `npm ci`.
2. Copy `.env.example` to `.env` and set `DATABASE_URL` and a unique `JWT_SECRET` of at least 32 characters.
3. Start MongoDB locally, then run `npm start` (or `npm run dev` during development).

The API listens on port `3000` by default; set `PORT` to change it. Never commit `.env` or use a real production secret in local examples.

## Checks

- `npm run lint` — ESLint.
- `npm test` — request and model validation checks that do not require MongoDB.

The database-backed user/card flows need a separate disposable MongoDB database and have not been run as part of this repository's current automated checks.

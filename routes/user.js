const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUserById,
  updateUserInfo,
  updateUserAvatar,
  getUserMe,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserMe);

router.get(
  '/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().length(24).hex(),
    }),
  }),
  getUserById,
);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      about: Joi.string().min(2).max(30).required(),
    }),
  }),
  updateUserInfo,
);

router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string()
        .required()
        .pattern(/https?:\/\/(www)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/i),
    }),
  }),
  updateUserAvatar,
);

module.exports = router;

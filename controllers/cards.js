const Card = require('../models/card');
const { errorMessage } = require('../utils/errorMessage');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => errorMessage(err, req, res));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;
  Card.create({ name, link, owner: ownerId })
    .then((card) => res.send({ data: card }))
    .catch((err) => errorMessage(err, req, res));
};

module.exports.deleteCard = (req, res) => {
  if (req.params.cardId === req.user._id) {
    Card.findByIdAndRemove(req.params.cardId)
      .orFail()
      .then((card) => res.send({ data: card }))
      .catch((err) => errorMessage(err, req, res));
  } else {
    res.status(401).send({ message: 'Нельзя удалять чужие карточки' });
  }
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch((err) => errorMessage(err, req, res));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch((err) => errorMessage(err, req, res));
};

const Card = require('../models/card');
const { ErrorNotFound, Forbidden } = require('../errors/allErrors');
const { errorMessage } = require('../utils/errorMessage');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;
  Card.create({ name, link, owner: ownerId })
    .then((card) => res.send({ data: card }))
    .catch((err) => errorMessage(err, req, res, next));
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new ErrorNotFound('Карточка с таким ID - не найдена');
    })
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        throw new Forbidden('Нельзя удалить чужую карточку');
      }
      return Card.findByIdAndDelete(card._id).then((deletedCard) => res.send(deletedCard));
    })
    .catch((err) => errorMessage(err, req, res, next));
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new ErrorNotFound('Карточка с таким ID - не найдена');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => errorMessage(err, req, res, next));
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new ErrorNotFound('Карточка с таким ID - не найдена');
    })
    .then((card) => res.send(card))
    .catch((err) => errorMessage(err, req, res, next));
};

const errorMessage = (err, req, res) => {
  if (err.name === 'CastError') {
    res.status(400).send({
      message: 'Invalid format of the transmitted data',
    });
    return;
  }
  if (err.name === 'ValidationError') {
    res.status(400).send({
      message: err.message,
    });
    return;
  }
  if (err.name === 'NotFoundError') {
    res.status(404).send({
      message: err.message,
    });
    return;
  }
  res.status(500).send({
    message: 'Request not processed',
  });
};

module.exports = { errorMessage };

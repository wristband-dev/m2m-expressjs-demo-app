'use strict';

// eslint-disable-next-line no-unused-vars
const errorHandler = function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    console.error('(ERROR HANDLER MIDDLEWARE) Invalid access token');
    res.status(401).send('Unauthorized');
  } else {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

module.exports = errorHandler;

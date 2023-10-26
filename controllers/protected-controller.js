'use strict';

exports.getProtectedData = (req, res) => {
  res.status(200).json({ protectedData: 'here I am' });
};

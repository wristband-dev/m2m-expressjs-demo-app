'use strict';

const protectedApiClient = require('../axios/protected-api-client');

exports.getPublicData = async (req, res) => {
  try {
    const response = await protectedApiClient.get('/data');
    res.status(200).json({ publicData: 'hello world', ...response.data });
  } catch (err) {
    if (err.response.status === 401) {
      res.status(401).send('Unauthorized');
    } else {
      throw err;
    }
  }
};

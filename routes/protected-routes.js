'use strict';

const express = require('express');
const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const protectedController = require('../controllers/protected-controller');
const { WRISTBAND_API_URL } = require('../utils/constants');

const router = express.Router();

router.use(
  jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `${WRISTBAND_API_URL}/v1/oauth2/jwks`,
    }),
    // Validate the issuer
    issuer: `https://${process.env.APPLICATION_VANITY_DOMAIN}`,
    algorithms: ['RS256'],
  }),
);

router.get('/data', protectedController.getProtectedData);

module.exports = router;

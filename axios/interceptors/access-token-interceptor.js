'use strict';

const { setAuthorizationHeader } = require('../../utils/util');

const wristbandM2MClient = require('../../include-m2m-sdk');

/*
 * This will set the Authorization header for any outgoing request.  The value is this M2M OAuth2 client's access token.
 * Before the token is set into the HTTP header, it will check if the access token is expired and refresh it as needed.
 */
const accessTokenInterceptor = async (config) => setAuthorizationHeader(config, await wristbandM2MClient.getToken());

module.exports = accessTokenInterceptor;

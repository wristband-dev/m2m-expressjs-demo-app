'use strict';

const retry = require('async/retry');
const http = require('http');
const moment = require('moment');
const stoppable = require('stoppable');

const app = require('./app');
const {
  ACCESS_TOKEN_EXPIRATION_KEY,
  ACCESS_TOKEN_KEY,
  CLIENT_CREDENTIALS_GRANT_TYPE,
  IS_ACCESS_TOKEN_REFRESHING_KEY,
} = require('./utils/constants');
const localCache = require('./cache/local-cache');
const wristbandApiClient = require('./axios/wristband-api-client');
const { getAccessTokenExpirationFromSeconds, onError, shutdown } = require('./utils/util');

app.set('port', 6001);

// Create the server and configure stoppable for graceful shutdown.
const server = stoppable(http.createServer(app));
server.on('error', (error) => onError(error));
server.on('listening', () => console.info('(SERVER STARTUP) Server is listening on port 6001'));

// Process handlers for a clean exit on Ctrl-C.
process.on('SIGINT', () => {
  console.info(`(SIGINT) Graceful shutdown at ${new Date().toISOString()}`);
  shutdown(server);
});
process.on('SIGTERM', () => {
  console.info(`(SIGTERM) Graceful shutdown at ${new Date().toISOString()}`);
  shutdown(server);
});

const getAccessToken = async () => {
  console.info('(SERVER STARTUP) Attempting to get access token...');
  const response = await wristbandApiClient.post('/v1/oauth2/token', CLIENT_CREDENTIALS_GRANT_TYPE);
  return response;
};

const setTokensIntoCache = (err, response) => {
  if (err) {
    return console.error('(SERVER STARTUP) Failed to get token credentials due to:', err);
  }

  localCache.set(ACCESS_TOKEN_KEY, response.data.access_token);
  localCache.set(IS_ACCESS_TOKEN_REFRESHING_KEY, false);

  const expirationTime = getAccessTokenExpirationFromSeconds(response.data.expires_in);
  localCache.set(ACCESS_TOKEN_EXPIRATION_KEY, expirationTime);
  return console.info(`(SERVER STARTUP) Access token acquired. Expires at ${moment(expirationTime)}`);
};

// Use client credentials grant type to get access token on startup and
// store it in local cache. Retries every 15 seconds for up to 48 hours.
retry(
  {
    times: 172800,
    interval: 15000,
  },
  getAccessToken,
  (err, response) => setTokensIntoCache(err, response),
);

// Start the server.
server.listen(6001);

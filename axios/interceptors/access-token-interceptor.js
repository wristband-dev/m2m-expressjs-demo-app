'use strict';

const retry = require('async/retry');

const {
  ACCESS_TOKEN_EXPIRATION_KEY,
  ACCESS_TOKEN_KEY,
  CLIENT_CREDENTIALS_GRANT_TYPE,
  IS_ACCESS_TOKEN_REFRESHING_KEY,
} = require('../../utils/constants');
const localCache = require('../../cache/local-cache');
const oauth2Client = require('../wristband-api-client');
const {
  getAccessTokenExpirationFromSeconds,
  isAccessTokenExpired,
  setAuthorizationHeader,
} = require('../../utils/util');

/*
 * This will set the Authorization header for any outgoing request.  The value is this M2M OAuth2 client's access token.
 * Before the token is set into the HTTP header, it will check if the access token is expired and refresh it as needed.
 */
const accessTokenInterceptor = async (config) => {
  const cachedAccessToken = localCache.get(ACCESS_TOKEN_KEY);
  const cachedTokenExpiration = localCache.get(ACCESS_TOKEN_EXPIRATION_KEY);

  // If the token exists and is not expired, then set the header and continue on.
  if (!!cachedAccessToken && !isAccessTokenExpired(cachedTokenExpiration)) {
    return setAuthorizationHeader(config, cachedAccessToken);
  }

  try {
    let updatedConfig = config;

    // Check if another request already started acquiring a new access token.
    if (localCache.get(IS_ACCESS_TOKEN_REFRESHING_KEY)) {
      // Wait for up to 5 seconds for the outstanding token request to complete. Otherwise throw an error.
      await retry(
        {
          times: 5,
          interval: 1000,
        },
        () => {
          if (localCache.get(IS_ACCESS_TOKEN_REFRESHING_KEY)) {
            throw new Error('Blocked by a prior request on acquiring a new token.');
          }

          console.info(`(TOKEN INTERCEPTOR) Token refresh is done waiting and can proceed`);
          updatedConfig = setAuthorizationHeader(config, localCache.get(ACCESS_TOKEN_KEY));
        },
        (err) => {
          if (err) {
            console.error(`(TOKEN INTERCEPTOR) Blocked by a prior request on acquiring a new token.`);
            throw err;
          }
        },
      );
      // Otherwise, make the request to Wristband to acquire a new access token.
    } else {
      // Lock the other requests from proceeding so as not to have requests fired off with an old access token.
      localCache.set(IS_ACCESS_TOKEN_REFRESHING_KEY, true);

      const tokenResponse = await oauth2Client.post('/v1/oauth2/token', CLIENT_CREDENTIALS_GRANT_TYPE);
      const { access_token: accessToken, expires_in: expiresIn } = tokenResponse.data;
      const tokenExpiration = getAccessTokenExpirationFromSeconds(expiresIn);

      localCache.set(ACCESS_TOKEN_KEY, accessToken);
      localCache.set(ACCESS_TOKEN_EXPIRATION_KEY, tokenExpiration);

      console.info('(TOKEN INTERCEPTOR) New access token acquired successfully');
      updatedConfig = setAuthorizationHeader(config, accessToken);
    }

    return updatedConfig;
  } catch (err) {
    console.error('(TOKEN INTERCEPTOR) New access token failure was due to: ', err);
    throw new Error('Failed to acquire a new access token prior to making a downstream API request');
  } finally {
    // Always release the lock so other requests don't get blocked.
    localCache.set(IS_ACCESS_TOKEN_REFRESHING_KEY, false);
  }
};

module.exports = accessTokenInterceptor;

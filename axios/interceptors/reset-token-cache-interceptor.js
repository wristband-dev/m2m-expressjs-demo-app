'use strict';

const constants = require('../../utils/constants');
const localCache = require('../../cache/local-cache');

/*
 * This will clear the access token and related fields from local memory cache in the event of a downstream API response
 * that results in an HTTP 401 Unauthorized response.
 */
const tokenCacheResetInterceptor = (error) =>
  new Promise((resolve, reject) => {
    if (error.response && error.response.status === 401 && !localCache.get(constants.IS_ACCESS_TOKEN_REFRESHING_KEY)) {
      console.warn('(TOKEN CACHE RESET INTERCEPTOR) Resetting access token cache...');
      localCache.set(constants.ACCESS_TOKEN_KEY, null);
      localCache.set(constants.ACCESS_TOKEN_EXPIRATION_KEY, null);
      localCache.set(constants.IS_ACCESS_TOKEN_REFRESHING_KEY, false);
    }

    reject(error);
  });

module.exports = tokenCacheResetInterceptor;

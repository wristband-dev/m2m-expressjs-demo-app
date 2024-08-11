'use strict';

const wristbandM2MClient = require('../../include-m2m-sdk');
/*
 * This will clear the access token and related fields from local memory cache in the event of a downstream API response
 * that results in an HTTP 401 Unauthorized response.
 */
const tokenCacheResetInterceptor = (error) =>
  new Promise((resolve, reject) => {
    if (error.response && error.response.status === 401) {
      console.warn('(TOKEN CACHE RESET INTERCEPTOR) Resetting access token cache...');
      wristbandM2MClient.clearToken();
    }

    reject(error);
  });

module.exports = tokenCacheResetInterceptor;

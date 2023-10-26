'use strict';

// //////////////////////////////////////////////////////////
// This HTTP client is used for making API requests using
// the access token that the server acquires upon startup.
// //////////////////////////////////////////////////////////

const axios = require('axios');

const accessTokenInterceptor = require('./interceptors/access-token-interceptor');
const resetTokenCacheInterceptor = require('./interceptors/reset-token-cache-interceptor');
const { JSON_MEDIA_TYPE, M2M_CLIENT_API_URL } = require('../utils/constants');
const { httpKeepAliveAgent, httpsKeepAliveAgent } = require('./keep-alive-agent/keep-alive-agent');

const protectedApiClient = axios.create({
  baseURL: `${M2M_CLIENT_API_URL}/protected`,
  httpAgent: httpKeepAliveAgent,
  httpsAgent: httpsKeepAliveAgent,
  headers: { 'Content-Type': JSON_MEDIA_TYPE, Accept: JSON_MEDIA_TYPE },
  maxRedirects: 0,
});

// Interceptors
protectedApiClient.interceptors.request.use(accessTokenInterceptor, (error) => Promise.reject(error));
protectedApiClient.interceptors.response.use((response) => Promise.resolve(response), resetTokenCacheInterceptor);

module.exports = protectedApiClient;

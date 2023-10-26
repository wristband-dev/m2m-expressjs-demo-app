'use strict';

const axios = require('axios');
const { FORM_URLENCODED_MEDIA_TYPE, JSON_MEDIA_TYPE, WRISTBAND_API_URL } = require('../utils/constants');
const { httpKeepAliveAgent, httpsKeepAliveAgent } = require('./keep-alive-agent/keep-alive-agent');

const { CLIENT_ID, CLIENT_SECRET } = process.env;

const wristbandApiClient = axios.create({
  auth: { username: CLIENT_ID, password: CLIENT_SECRET },
  baseURL: WRISTBAND_API_URL,
  httpAgent: httpKeepAliveAgent,
  httpsAgent: httpsKeepAliveAgent,
  headers: { 'Content-Type': FORM_URLENCODED_MEDIA_TYPE, Accept: JSON_MEDIA_TYPE },
  maxRedirects: 0,
});

module.exports = wristbandApiClient;

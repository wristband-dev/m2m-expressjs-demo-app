'use strict';

const moment = require('moment');

exports.onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  switch (error.code) {
    case 'EACCES':
      console.error(`(SERVER STARTUP) Requires elevated privileges to run server!`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`(SERVER STARTUP) Port 6001 is already in use!`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

exports.shutdown = (server) => {
  console.info('(SERVER SHUTDOWN) Stopping server via stoppable...');
  server.stop();

  console.info('(SERVER SHUTDOWN) Exiting process...');
  process.exit();
};

exports.setAuthorizationHeader = (config, accessToken) => {
  const copiedConfig = { ...config };
  copiedConfig.headers.Authorization = accessToken ? `Bearer ${accessToken}` : '';
  return copiedConfig;
};

exports.isAccessTokenExpired = (expiresAtMs) => {
  if (!expiresAtMs) {
    return true;
  }

  const currentTime = moment().valueOf();
  const isExpired = currentTime >= expiresAtMs;

  if (isExpired) {
    console.warn('Access token was found to be expired.');
  }

  return isExpired;
};

exports.getAccessTokenExpirationFromSeconds = (numOfSeconds) => moment().add(numOfSeconds, 'seconds').valueOf();

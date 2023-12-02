'use strict';


const http = require('http');

const stoppable = require('stoppable');

const app = require('./app');

const {onError, shutdown} = require('./utils/util');

const wristbandM2MClient = require('./include-m2m-sdk')
const retry = require('async-retry');

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

// Optimization : Pre-fetch M2M token to store it in cache
retry(
    async () => {
      await wristbandM2MClient.getToken();
    },
    {
      retries: 172800,
      minTimeout: 15000
    });

// Start the server.
server.listen(6001);

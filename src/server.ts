import stoppable from 'stoppable';
import http from 'http';
import retry from 'async-retry';

import app from './app';
import { wristbandM2MAuth } from './wristband';

const onError = (error: Error): void => {
  if (!('syscall' in error) || !('code' in error)) {
    throw error;
  }

  if (error.syscall !== 'listen') {
    throw error;
  }

  switch (error.code) {
    case 'EACCES':
      console.error('(SERVER STARTUP) Requires elevated privileges to run server!');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error('(SERVER STARTUP) Port 6001 is already in use!');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const shutdown = (server: any): void => {
  console.info('(SERVER SHUTDOWN) Stopping server via stoppable...');
  server.stop();

  console.info('(SERVER SHUTDOWN) Exiting process...');
  process.exit();
};


app.set('port', 6001);

// Create the server and configure stoppable for graceful shutdown.
const server = stoppable(http.createServer(app));
server.on('error', (error: Error) => onError(error));
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

/* WRISTBAND_TOUCHPOINT */
// Optimization: pre-fetch M2M token on startup to warm the cache and avoid
// cold-start latency on the first request.
retry(
  async () => {
    try {
      await wristbandM2MAuth.getToken();
      console.log(`M2M access token acquired at: ${new Date()}`);
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  {
    retries: 172800,
    minTimeout: 15000,
  },
);

// Start the server.
server.listen(6001);

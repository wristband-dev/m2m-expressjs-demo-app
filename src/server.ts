import stoppable from 'stoppable';
import http from 'http';
import retry from 'async-retry';

import app from './app';
import { onError, shutdown } from './utils/util';
import { wristbandM2MAuth } from './wristband';

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

// Optimization: Pre-fetch M2M token to store it in cache.
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

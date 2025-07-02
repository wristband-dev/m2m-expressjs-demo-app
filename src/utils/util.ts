export const onError = (error: Error): void => {
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
export const shutdown = (server: any): void => {
  console.info('(SERVER SHUTDOWN) Stopping server via stoppable...');
  server.stop();

  console.info('(SERVER SHUTDOWN) Exiting process...');
  process.exit();
};

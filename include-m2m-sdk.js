const { WristbandM2MClient } = require('@wristband/node-m2m-auth');

const wristbandM2MClient = new WristbandM2MClient({
  appDomain: process.env.APPLICATION_VANITY_DOMAIN,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

module.exports = wristbandM2MClient;

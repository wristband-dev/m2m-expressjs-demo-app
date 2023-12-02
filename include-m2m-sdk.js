const {WristbandM2MClient} = require('wristband-node-m2m');
const APPLICATION_DOMAIN = process.env.APPLICATION_DOMAIN;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const wristbandM2MClient = new WristbandM2MClient({
    appDomain: APPLICATION_DOMAIN, clientId: CLIENT_ID, clientSecret: CLIENT_SECRET
});


module.exports = wristbandM2MClient;
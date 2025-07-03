import { createWristbandJwtValidator } from '@wristband/typescript-jwt';
import { WristbandM2MClient } from '@wristband/node-m2m-auth';

const wristbandM2MAuth = new WristbandM2MClient({
  appDomain: process.env.APPLICATION_VANITY_DOMAIN!,
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
});

const wristbandJwtValidator = createWristbandJwtValidator({
  wristbandApplicationVanityDomain: process.env.APPLICATION_VANITY_DOMAIN!,
});

export { wristbandM2MAuth, wristbandJwtValidator };

import { createWristbandJwtValidator } from '@wristband/typescript-jwt';
import { createWristbandM2MClient } from '@wristband/typescript-m2m-auth';

/* WRISTBAND_TOUCHPOINT - M2M client for obtaining access tokens for server-to-server requests. */
const wristbandM2MAuth = createWristbandM2MClient({
  wristbandApplicationVanityDomain: process.env.APPLICATION_VANITY_DOMAIN!,
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
});

/* WRISTBAND_TOUCHPOINT - JWT validator for verifying access tokens on incoming requests. */
const wristbandJwtValidator = createWristbandJwtValidator({
  wristbandApplicationVanityDomain: process.env.APPLICATION_VANITY_DOMAIN!,
});

export { wristbandM2MAuth, wristbandJwtValidator };

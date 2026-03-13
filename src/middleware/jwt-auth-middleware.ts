import { Request, Response, NextFunction } from 'express';
import { wristbandJwtValidator } from '../wristband';

/* WRISTBAND_TOUCHPOINT */
// Validates the JWT access token on incoming requests using the Wristband typescript-jwt SDK.
const jwtAuthMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = wristbandJwtValidator.extractBearerToken(req.headers.authorization);
    const result = await wristbandJwtValidator.validate(token);

    if (!result.isValid) {
      console.error('(JWT AUTH MIDDLEWARE) -> ', result.errorMessage);
      res.status(401).send();
      return;
    }

    next();
  } catch (error) {
    console.error('(JWT AUTH MIDDLEWARE) -> ', error);
    res.status(401).send();
  }
};

export default jwtAuthMiddleware;

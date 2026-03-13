import { NextFunction, Request, Response } from 'express';

const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error('(ERROR HANDLER MIDDLEWARE) -> ', err);
  res.status(500).send('Server Error');
};

export default errorMiddleware;

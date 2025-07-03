import { Request, Response } from 'express';

const errorHandler = (err: Error, req: Request, res: Response): void => {
  console.error('(ERROR HANDLER MIDDLEWARE) -> ', err);
  res.status(500).send('Server Error');
};

export default errorHandler;

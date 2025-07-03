import express, { Request, Response } from 'express';
import { AxiosError } from 'axios';

import { jwtAuthMiddleware } from '../middleware';
import { protectedApiClient } from '../client';

const apiRoutes = express.Router();

// Public Data Endpoint
apiRoutes.get('/public/data', async (req: Request, res: Response): Promise<void> => {
  try {
    const response = await protectedApiClient.get('/data');
    console.log('Protected data fetched successfully!!');
    res.status(200).json({ publicData: 'hello world', ...response.data });
  } catch (err) {
    const axiosError = err as AxiosError;
    if (axiosError.response?.status === 401) {
      res.status(401).send('Unauthorized');
    } else {
      throw err;
    }
  }
});

// Protected Data Endpoint (Requires Valid Access Token)
apiRoutes.get('/protected/data', jwtAuthMiddleware, async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({ protectedData: 'Here I am!!!' });
});

export default apiRoutes;

import express from 'express';

import { errorMiddleware } from './middleware';
import apiRoutes from './routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
app.use('/api', apiRoutes);

app.use(errorMiddleware);

export default app;

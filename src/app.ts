const express = require('express');
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { Request, Response } from 'express';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import router from './app/routes';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ['http://localhost:5005'] }));

app.use('/api', router);

const rootController = (req: Request, res: Response) => {
  res.send('Hello World!');
};

app.get('/api/', rootController);

app.use(globalErrorHandler);

export default app;

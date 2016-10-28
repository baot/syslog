/* eslint no-console: 0 */

import express from 'express';
import morgan from 'morgan';

import { getLogsWithParams } from './controllers/logs';

const app = express();

// logging request for app
app.use(morgan('dev'));

// ROUTES
app.use('/api/logs', getLogsWithParams);

export default app;

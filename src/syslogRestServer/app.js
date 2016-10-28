/* eslint no-console: 0 */

import express from 'express';
import morgan from 'morgan';

import { getLogsWithParams } from './controllers/logs';
import { getStats } from './controllers/stats';

const app = express();

// logging request for app
app.use(morgan('dev'));

// ROUTES
app.use('/api/logs', getLogsWithParams);
app.use('/api/stats', getStats);

export default app;

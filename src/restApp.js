/* eslint no-console: 0 */

import express from 'express';

const restApp = express();

restApp.get('/', (req, res) => {
  res.json({ msg: 'Hello World!' });
});

export default restApp;

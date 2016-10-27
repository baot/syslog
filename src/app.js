/* eslint no-console: 0 */

import http from 'http';
import express from 'express';
import { argv } from 'optimist';


const syslogPort = argv.s;
const apiPort = argv.r;

/*
 * SERVER
 */

// Syslog message receive
const sysLog = (req, res) => {
  res.write(`sysLog at port ${syslogPort}`);
  res.end();
};

// Rest Api
const app = express();

const syslogMessageServer = http.createServer(sysLog).listen(syslogPort, 'localhost', (err) => {
  if (err) return console.error(err);
  return console.info(`Syslog message listening at ${syslogPort}`);
});

const syslogRestServer = http.createServer(app).listen(apiPort, 'localhost', (err) => {
  if (err) return console.error(err);
  return console.info(`Syslog Rest Api listening at ${apiPort}`);
});

export default { syslogMessageServer, syslogRestServer };
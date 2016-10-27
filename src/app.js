/* eslint no-console: 0 */

import http from 'http';
import express from 'express';
import Datastore from 'nedb';
import { argv } from 'optimist';

const syslogPort = argv.s;
const apiPort = argv.r;

/*
 * DATABASE
 */

const db = new Datastore({
  filename: 'syslog.db', // path to data file,
  autoload: true,  // automatically load the db
});

//
const syslogMessage = {
  time: '2014-09-01',
  ip: '172.16.100.162',
  cat: 'NETCON',
  event: 'init_complete',
  action: null,
  message: null,
};

db.insert(syslogMessage, (err, msg) => {
  if (err) console.error(err);
  console.info(msg);
});


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

/* eslint no-console: 0 */

import Datastore from 'nedb';
import { argv } from 'optimist';

import syslogServer from './syslogserver';

const syslogPort = argv.s;
const apiPort = argv.r;

/*
 * DATABASE
 */

const db = new Datastore({
  filename: 'syslog.db', // path to data file,
  autoload: true,  // automatically load the db
});

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
 * APP BOOTSTRAP
 */
syslogServer.start(syslogPort, apiPort, () => {
  console.info('app start');
});

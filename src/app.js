/* eslint no-console: 0 */

import { argv } from 'optimist';

import syslogServer from './syslogserver';

const syslogPort = argv.s;
const apiPort = argv.r;

/*
 * APP BOOTSTRAP
 */
syslogServer.start(syslogPort, apiPort, () => {
  console.info('app start');
});

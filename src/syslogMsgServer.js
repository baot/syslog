/* eslint no-console: 0 */

import dgram from 'dgram';

import db from './db';
import { composeSyslogMsg } from './lib';

const syslogMsgServer = dgram.createSocket('udp4');

// Listen for message event
syslogMsgServer.on('message', (msg, requestInfo) => {
  console.info(`syslogMsg: ${msg} from ${requestInfo.address}:${requestInfo.port}`);
  /*
   * create syslog msg obj and add to database
   */
  const syslogMsg = composeSyslogMsg(msg.toString(), requestInfo.address);
  db.insert(syslogMsg, (err, message) => {
    if (err) console.error(err);
    console.info(message);
  });
});

// Close server on error event
syslogMsgServer.on('error', (err) => {
  console.error(err);
  syslogMsgServer.close();
});

// Log info on listening event
syslogMsgServer.on('listening', () => {
  const address = syslogMsgServer.address();
  console.info(`syslogMsgServer listening at ${address.address}:${address.port}`);
});

export default syslogMsgServer;

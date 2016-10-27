/* eslint no-console: 0 */

import dgram from 'dgram';

const syslogMsgServer = dgram.createSocket('udp4');

// Listen for message event
syslogMsgServer.on('message', (msg, requestInfo) => {
  console.info(`syslogMsg: ${msg} from ${requestInfo.address}:${requestInfo.port}`);
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

/* eslint no-console: 0 */

import syslogMsgServer from './syslogMsgServer';
import syslogRestServer from './syslogRestServer/app';

let restServer;

function start(syslogPort, restPort, callback) {
  // Start listening for syslogMessage udp server
  syslogMsgServer.bind({
    address: 'localhost',
    port: syslogPort,
  });

  // Start listening for rest api
  restServer = syslogRestServer.listen(restPort, () => {
    console.info(`syslogRestServer listening on port ${restPort}`);
  });

  callback();
}

function stop() {
  if (restServer) { restServer.stop(); }
  syslogMsgServer.stop();
}

export default {
  start,
  stop,
};

/* eslint no-console: 0 , import/prefer-default-export: 0 */

import { nth, prop, compose } from 'ramda';

import db from '../../db';

const getStats = (req, res) => {
  // Number of successfully received and parsed logs
  const numReceivedLogs = new Promise((resolve, reject) => {
    db.count({
      time: { $ne: null },
      ip: { $ne: null },
      cat: { $ne: null },
      event: { $ne: null },
    }, (err, count) => {
      if (err) reject(err);
      resolve(count);
    });
  });

  // Number of malformed logs
  const numMalformedLogs = new Promise((resolve, reject) => {
    db.count({ $or: [
      { time: null },
      { ip: null },
      { cat: null },
      { event: null },
    ] }, (err, count) => {
      if (err) reject(err);
      resolve(count);
    });
  });

  // Event time of first received log in ISO 8601 format
  const firstReceivedLog = new Promise((resolve, reject) => {
    db.find({}, { time: 1, _id: 0 }).sort({ createdAt: 1 }).limit(1).exec((err, docs) => {
      if (err) reject(err);
      if (docs.length === 1) resolve(docs[0]);
      resolve('');
    });
  });

  // Event time of last received log in ISO 8601 format
  const lastReceivedLog = new Promise((resolve, reject) => {
    db.find({}, { time: 1, _id: 0 }).sort({ createdAt: -1 }).limit(1).exec((err, docs) => {
      if (err) reject(err);
      if (docs.length === 1) resolve(docs[0]);
      resolve('');
    });
  });

  // start ops in parallel and collect results when all resolve
  Promise.all([
    numReceivedLogs,
    numMalformedLogs,
    firstReceivedLog,
    lastReceivedLog,
  ]).then((values) => {
    res.json({
      received: nth(0)(values),
      malformed: nth(1)(values),
      first: compose(time => time || '', prop('time'), nth(2))(values),
      last: compose(time => time || '', prop('time'), nth(3))(values),
    });
  }).catch((err) => {
    console.error(err);
    res.status(500).json({ error: 'something wrong' });
  });
};

export { getStats };

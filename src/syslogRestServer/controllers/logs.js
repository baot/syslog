/* eslint no-console: 0 */

import { has, isEmpty, keys } from 'ramda';

import db from '../../db';

/*
 * return most {num} recent received logs
 */
const getLogs = (req, res, num) => {
  db.find({}, { createdAt: 0, updatedAt: 0 })
    .sort({ createdAt: -1 })
    .limit(num)
    .exec((err, docs) => {
      if (err) {
        res.status(500).json({ error: 'something went wrong' });
        return;
      }

      res.json(docs);
    });
};

/*
 * return logs with matched params
 * todo: refactor
 */
const getLogsWithParams = (req, res) => {
  const params = req.query;
  const num = params.num ? params.num : 20;
  if (isEmpty(params) || (keys(params).length === 1 && has('num')(params))) {
    return getLogs(req, res, num);
  }

  const startTime = params.startTime ? new Date(params.startTime) : null;
  const endTime = params.endTime ? new Date(params.endTime) : null;
  const ip = params.ip;
  const cat = params.cat ? params.cat.toLowerCase() : null;
  const event = params.event ? params.event.toLowerCase() : null;
  const action = params.action ? params.action.toLowerCase() : null;

  return db.find({
    $where: function where() {
      const docDate = (new Date(this.time)).getTime();
      let passed = true;

      if (startTime && docDate < startTime.getTime()) passed = false;
      else if (endTime && docDate > endTime.getTime()) passed = false;
      else if (ip && ip !== this.ip) passed = false;
      else if (cat && this.cat.toLowerCase().indexOf(cat) === -1) passed = false;
      else if (event && this.event.toLowerCase().indexOf(event) === -1) passed = false;
      else if (action && !has('action')(this)) passed = false;
      else if (action && this.action.toLowerCase().indexOf(action) === -1) passed = false;

      return passed;
    },
  }, { createdAt: 0, updatedAt: 0 }).limit(num).exec((err, docs) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'something wrong' });
      return;
    }

    res.json(docs);
  });
};

export { getLogs, getLogsWithParams };

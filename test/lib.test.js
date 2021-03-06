/* eslint no-undef: 0 */

import expect from 'expect';
import Either from 'monet';

import { getTime, getCategory, getEvent, getExtra, composeSyslogMsg } from '../src/lib';

describe('Lib Test', () => {
  const syslogMsg = '<134>[2014-09-01 13:04:11] EFW: SYSTEM: prio=2 id=03200607 rev=2 event=bidir_ok localcfgver=258 remotecfgver=0';
  const syslogMsgEvent = '<134>[2014-09-01 13:04:11] EFW: SYSTEM: prio=2 id=03200607 rev=2 event=bidir_ok';
  const notSyslogMsg = 'null';

  describe('getTime Test', () => {
    it('should return Either Right correct time', () => {
      const result = '2014-09-01 13:04:11';
      expect(getTime(syslogMsg)).toEqual(Either.Right(result));
      expect(getTime(syslogMsgEvent)).toEqual(Either.Right(result));
    });

    it('should return Either Left null', () => {
      expect(getTime(notSyslogMsg)).toEqual(Either.Left(null));
    });
  });

  describe('getCategory Test', () => {
    it('should return Either Right correct category', () => {
      const result = 'SYSTEM';
      expect(getCategory(syslogMsg)).toEqual(Either.Right(result));
      expect(getCategory(syslogMsgEvent)).toEqual(Either.Right(result));
    });

    it('should return Either Left null', () => {
      expect(getTime(notSyslogMsg)).toEqual(Either.Left(null));
    });
  });

  describe('getEvent Test', () => {
    it('should return Either Right correct time', () => {
      const result = 'bidir_ok';
      expect(getEvent(syslogMsg)).toEqual(Either.Right(result));
      expect(getEvent(syslogMsgEvent)).toEqual(Either.Right(result));
    });

    it('should return Either Left null', () => {
      expect(getEvent(notSyslogMsg)).toEqual(Either.Left(null));
    });
  });

  describe('getExtra Test', () => {
    const syslogMsgWithActionMsg = '<134>[2014-09-01 13:04:11] EFW: SYSTEM: prio=2 id=03204001 rev=1 event=accept_configuration action=using_new_config localcfgver=258 remotecfgver=0';
    const syslogMsgWithAction = '<134>[2014-09-01 13:04:11] EFW: SYSTEM: prio=2 id=03204001 rev=1 event=accept_configuration action=using_new_config';
    const syslogMsgNoActionMsg = '<134>[2014-09-01 13:04:11] EFW: SYSTEM: prio=2 id=03204001 rev=1 event=accept_configuration';

    it('should return Either Right object with valid message and valid action', () => {
      const result = { message: 'localcfgver=258 remotecfgver=0', action: 'using_new_config' };
      expect(getExtra(syslogMsgWithActionMsg)).toEqual(Either.Right(result));
    });

    it('should return Either Right object with valid action & undefined message', () => {
      const result = { message: undefined, action: 'using_new_config' };
      expect(getExtra(syslogMsgWithAction)).toEqual(Either.Right(result));
    });

    it('should return Either Right object with valid message & undefined action', () => {
      const result = { message: 'localcfgver=258 remotecfgver=0', action: undefined };
      expect(getExtra(syslogMsg)).toEqual(Either.Right(result));
    });

    it('should return Either Left null', () => {
      expect(getExtra(syslogMsgNoActionMsg)).toEqual(Either.Left(null));
      expect(getExtra(syslogMsgEvent)).toEqual(Either.Left(null));
    });
  });

  describe('composeSyslogMsg Test', () => {
    const syslogMsgWithAction = '<134>[2014-09-01 13:04:11] EFW: SYSTEM: prio=2 id=03204001 rev=1 event=accept_configuration action=using_new_config';
    const ip = '127.0.0.1';
    it('should return correct syslogMsg object with action', () => {
      const result = {
        time: '2014-09-01T10:04:11.000Z',
        ip,
        cat: 'SYSTEM',
        event: 'accept_configuration',
        action: 'using_new_config',
        // message: ignore for now
      };
      expect(composeSyslogMsg(syslogMsgWithAction, ip)).toEqual(result);
    });

    it('should return correct syslogMsg object with undefined action', () => {
      const result = {
        time: '2014-09-01T10:04:11.000Z',
        ip,
        cat: 'SYSTEM',
        event: 'bidir_ok',
        action: undefined,
        // message: ignore for now
      };
      expect(composeSyslogMsg(syslogMsgEvent, ip)).toEqual(result);
    });
  });
});

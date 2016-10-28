import { curry, nth, compose, map } from 'ramda';
import { Either } from 'monet';

const syslogpattern = /^<.+>\[(.+)\]\sEFW:\s(.+):\sprio=(.+)\sid=(.+)\srev=(.+)\sevent=(.+?)\s(.+)/;
const syslogExtrapattern = /^action=(.+?)(\s(.+))?$/;

// regex => str => Either(Right(List[str]), Left(null))
const parse = curry((pattern, str) => {
  const result = str.match(pattern);
  return result ? Either.Right(result) : Either.Left(result);
});

/*
 * suppose theres always a valid str as arg
 * refactor
 */
const parseExtraHelper = (str) => {
  let message;
  let action;
  const result = parse(syslogExtrapattern)(str);

  if (result.isRight()) { // there is action
    if (map(nth(2))(result)) { // message will be 3rd of result
      message = map(nth(3))(result).right();
    }
    // no message
    action = map(nth(1))(result).right();
    return { message, action };
  }

  // message is also the arg
  return {
    message: str,
    action,
  };
};

// getExtra :: (str: syslog) => {message: <message>/undefined, action: <action>/undefined}
const getExtra = compose(
  map(compose(parseExtraHelper, nth(7))),
  parse(syslogpattern)
);

// getTime :: (str: syslog) => (str: <event date UTC>)/undefined
const getTime = compose(map(nth(1)), parse(syslogpattern));

// getCategory :: (str: syslog) => (str: <category>)/undefined
const getCategory = compose(map(nth(2)), parse(syslogpattern));

// getEvent :: (str: syslog) => (str: <event>)/undefined
const getEvent = compose(map(nth(6)), parse(syslogpattern));

// refactor: apply ramda here & looking for exceptional case
const composeSyslogMsg = (msg, ip) => {
  const timeString = getTime(msg).right();
  const time = new Date(timeString).toISOString();
  return {
    time,
    ip,
    cat: getCategory(msg).right(),
    event: getEvent(msg).right(),
    action: (getExtra(msg).right()) ? getExtra(msg).right().action : undefined,
    // message: ignore for now
  };
};

export { composeSyslogMsg };

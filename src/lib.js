import { curry, nth, compose, map } from 'ramda';
import { Either } from 'monet';

// eslint-disable-next-line max-len
const syslogpattern = /^<.+>\[(.+)\]\sEFW:\s(.+):\sprio=(.+)\sid=(.+)\srev=(.+)\sevent=(.+?)(\s.*)?$/;
const syslogExtrapattern = /^action=(.+?)(\s(.+))?$/;

//  chain :: Monad m => (a -> m b) -> m a -> m b
const chain = curry((f, m) => m.map(f).join());

// regex => str => Either(Right(List[str]), Left(null))
const parse = curry((pattern, str) => {
  let result;
  if (str) {
    result = str.match(pattern);
  }
  return result ? Either.Right(result) : Either.Left(result);
});

/*
 * suppose theres always a valid str as arg
 * refactor
 */
const parseExtraHelper = (str) => {
  let message;
  let action;
  const result = parse(syslogExtrapattern)(str.trim());

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
    message: str.trim(),
    action,
  };
};

// getExtra :: (str: syslog) => {message: <message>/undefined, action: <action>/undefined}
const getExtra = compose(
  map(parseExtraHelper),
  chain(str => (str ? Either.Right(str) : Either.Left(null))),
  map(nth(7)),
  parse(syslogpattern)
);

// getTime :: (str: syslog) => (str: <event date UTC>)/undefined
const getTime = compose(map(nth(1)), parse(syslogpattern));

// getCategory :: (str: syslog) => (str: <category>)/undefined
const getCategory = compose(map(nth(2)), parse(syslogpattern));

// getEvent :: (str: syslog) => (str: <event>)/undefined
const getEvent = compose(map(nth(6)), parse(syslogpattern));

// refactor: apply ramda here & looking for exceptional case
// null in time, ip, cat, event indicates malformed logs
const composeSyslogMsg = (msg, ip) => {
  const time = getTime(msg).isRight() ? new Date(getTime(msg).right()).toISOString() : null;
  return {
    time,
    ip,
    cat: getCategory(msg).isRight() ? getCategory(msg).right() : null,
    event: getCategory(msg).isRight() ? getEvent(msg).right() : null,
    action: (getExtra(msg).isRight()) ? getExtra(msg).right().action : undefined,
    // message: ignore for now
  };
};

export { getTime, getCategory, getEvent, getExtra, composeSyslogMsg };

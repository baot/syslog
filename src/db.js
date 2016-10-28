import Datastore from 'nedb';

const db = new Datastore({
  filename: 'logdb.json', // path to data file,
  autoload: true,  // automatically load the db
});

export default db;

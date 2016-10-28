import Datastore from 'nedb';

const db = new Datastore({
  filename: 'logdb.json', // path to data file,
  autoload: true,  // automatically load the db
  timestampData: true, // add field createdAt and updatedAt
});

export default db;

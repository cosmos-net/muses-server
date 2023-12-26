/* eslint-disable hexagonal-architecture/enforce */
db = db.getSiblingDB('muses');

db.createUser({
  user: 'root',
  pwd: 'toor',
  roles: [
    {
      role: 'readWrite',
      db: 'muses',
    },
  ],
});

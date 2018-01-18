const session = require('express-session');
const uri = require('./config.json')[process.env.NODE_ENV];
const MongoDBStore = require('connect-mongodb-session')(session);

module.exports = new MongoDBStore({
  uri,
  collection: 'sessions'
});
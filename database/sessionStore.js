const uri = process.env.DB_HOST;
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

module.exports = new MongoDBStore({uri, collection: 'sessions'});
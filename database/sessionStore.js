const session = require('express-session');
const Store = require('connect-session-sequelize')(session.Store);
const connection = require('./connection');
module.exports = new Store({db: connection});
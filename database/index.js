const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const uri = process.env.DB_HOST;
mongoose.connect(uri);

const { on } = require('./middleware');
const store = require('./sessionStore');
const User = require('./models/user');
const Friend = require('./models/friend');

module.exports = {
  on,
  store,
  User,
  Friend
};
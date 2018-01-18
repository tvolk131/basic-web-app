const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const uri = process.env.DB_HOST;
const user = process.env.DB_USERNAME;
const pass = process.env.DB_PASSWORD;
mongoose.connect(uri, {user, pass});

const User = require('./models/user');
const Friend = require('./models/friend');

module.exports = {
  User,
  Friend
};
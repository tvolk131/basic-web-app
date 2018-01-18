const googleAuth = require('./strategies/google.js');
const userSerializeDeserialize = require('./user');

module.exports = (userModel) => {
  googleAuth(userModel);
  userSerializeDeserialize(userModel);
};
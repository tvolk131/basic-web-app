const mockDB = require('./mockDB.json');
const {User} = require('../../database');

module.exports.createUsers = () => {
  let promises = [];
  mockDB.users.forEach((user) => {
    promises.push(
      User.model.create(user)
    );
  });
  return Promise.all(promises);
};
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const { execMiddleware } = require('../middleware');

const User = new Schema({
  name: String,
  oAuthProvider: String,
  oAuthId: String
});
User.index({oAuthProvider: 1, oAuthId: 1}, {unique: true});
const UserModel = mongoose.model('User', User);

const create = ({name, oAuthProvider, oAuthId}) => {
  if (!(name && oAuthId && oAuthProvider)) {
    return Promise.reject('Not all fields were provided');
  }

  return new Promise((resolve, reject) => {
    let user = new UserModel();
    user.name = name;
    user.oAuthId = oAuthId;
    user.oAuthProvider = oAuthProvider;
    user.save((err) => {
      if (err) {
        reject(err);
      } else {
        resolve(user);
      }
    });
  }).then((data) => (execMiddleware('User.create', data)));
};

const get = ({id, oAuthProvider, oAuthId}) => {
  if (!(id || oAuthId || oAuthProvider)) {
    throw new Error('Must provide ID or oAuth');
  }
  if ((!id && oAuthId && oAuthProvider) && (id && !oAuthId && !oAuthProvider)) {
    throw new Error('Must provide either ID or oAuth, not both');
  }
  let query = id ? { _id: id } : { oAuthId, oAuthProvider };


  return new Promise((resolve, reject) => {
    UserModel.findOne(query, (err, user) => {
      if (err) {
        reject(err);
      } else {
        resolve(user);
      }
    });
  }).then((data) => (execMiddleware('User.get', data)));
};

const setName = ({id, oAuthId, oAuthProvider}, name) => {
  if (!(id || oAuthId || oAuthProvider)) {
    throw new Error('Must provide ID or oAuth');
  }
  if ((!id && oAuthId && oAuthProvider) && (id && !oAuthId && !oAuthProvider)) {
    throw new Error('Must provide either ID or oAuth, not both');
  }
  let query = id ? { _id: id } : { oAuthId, oAuthProvider };
  return new Promise((resolve, reject) => {
    UserModel.update(query, { $set: { name } }, {}, (err, results) => {
      if (err) {
        reject(err);
      } else if (results.n < 1) {
        reject('No user was found');
      } else if (results.n > 1) {
        reject('Somehow more than one user was updated');
      } else {
        resolve(!!results.nModified);
      }
    });
  }).then((data) => (execMiddleware('User.setName', data)));
};

const mapFromIds = (userIds) => {
  userIds = Array.from(userIds);
  if (!userIds.length) {
    return Promise.resolve([]);
  }
  return new Promise((resolve, reject) => {
    UserModel.find({$or: userIds.map((_id) => ({_id}))}, (err, users) => {
      if (err) {
        reject(err);
      } else {
        resolve(users);
      }
    });
  }).then((data) => (execMiddleware('User.mapFromIds', data)));
};

module.exports = {
  create,
  get,
  setName,
  mapFromIds
};
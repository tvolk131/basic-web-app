const mongoose = require('mongoose');
const User = require('./user');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const Friend = new Schema({
  senderId: String,
  receiverId: String
});
Friend.index({senderId: 1, receiverId: 1}, {unique: true});
Friend.index({receiverId: 1, senderId: 1}, {unique: true});
const FriendModel = mongoose.model('Friend', Friend);


const getFriendData = (userId) => {
  return new Promise((resolve, reject) => {
    FriendModel.find({senderId: userId}, (err, requestsSent) => {
      if (err) {
        reject(err);
      } else {
        FriendModel.find({receiverId: userId}, (err, requestsReceived) => {
          if (err) {
            reject(err);
          } else {
            requestsSent = requestsSent.map(item => item.receiverId);
            requestsReceived = requestsReceived.map(item => item.senderId);
            let sent = new Set(requestsSent);
            let received = new Set(requestsReceived);
            let friends = new Set();
            for (let item in sent) {
              if (received.has(item)) {
                friends.add(item);
                sent.delete(item);
                received.delete(item);
              }
            }
            resolve({sent, received, friends});
          }
        });
      }
    });
  });
};

const getFriends = (userId) => {
  return getFriendData(userId)
    .then(({friends}) => {
      return User.mapFromIds(friends);
    });
};

const getSentRequests = (userId) => {
  return getFriendData(userId)
    .then(({sent}) => {
      return User.mapFromIds(sent);
    });
};

const getReceivedRequests = (userId) => {
  return getFriendData(userId)
    .then(({received}) => {
      return User.mapFromIds(received);
    });
};

const getAll = (userId) => {
  return getFriendData(userId)
    .then(({sent, received, friends}) => {
      return Promise.all([
        User.mapFromIds(sent),
        User.mapFromIds(received),
        User.mapFromIds(friends)
      ]);
    })
    .then(([sent, received, friends]) => ({sent, received, friends}));
};

const addUser = (senderId, receiverId) => {
  return new Promise((resolve, reject) => {
    let request = new FriendModel();
    request.senderId = senderId;
    request.receiverId = receiverId;
    request.save((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

const removeUser = (senderId, receiverId) => {
  return new Promise((resolve, reject) => {
    FriendModel.remove({$or: [{senderId, receiverId}, {senderId: receiverId, receiverId: senderId}]}, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

module.exports = {
  getFriends,
  getSentRequests,
  getReceivedRequests,
  getAll,
  addUser,
  removeUser
};
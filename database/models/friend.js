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
            let sent = {};
            let received = {};
            let friends = {};
            requestsSent.forEach((item) => {
              sent[item] = true;
            });
            requestsReceived.forEach((item) => {
              if (sent[item]) {
                delete sent[item];
                friends[item] = true;
              } else {
                received[item] = true;
              }
            });
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

const addUser = (adderId, addeeId) => {
  return new Promise((resolve, reject) => {
    let request = new FriendModel();
    request.senderId = senderId;
    request.receiverId = receiverId;
    request.save((err) => {
      if (err) {
        reject(err);
      } else {
        resolve(user);
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
  addUser,
  removeUser
};
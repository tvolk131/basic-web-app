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

const assertUsersExist = (userIds) => {
  return Promise.all(userIds.map((userId) => {
    return User.get({id: userId})
      .then(user => {
        if (!user) {
          return Promise.reject('User does not exist');
        }
      });
  }))
    .then(() => {
      return undefined;
    });
};



const getFriends = (userId) => {
  return new Promise((resolve, reject) => {
    getFriendData(userId)
      .then(({friends}) => {
        FriendModel.find({_id: { $in: Object.keys(friends)}}, (err, friends) => {
          resolve(friends);
        });
      });
  });
};

const getSentRequests = (userId) => {
  return new Promise((resolve, reject) => {
    getFriendData(userId)
      .then(({sent}) => {
        FriendModel.find({_id: { $in: Object.keys(sent)}}, (err, friends) => {
          resolve(friends);
        });
      });
  });
};

const getReceivedRequests = (userId) => {
  return new Promise((resolve, reject) => {
    getFriendData(userId)
      .then(({received}) => {
        FriendModel.find({_id: { $in: Object.keys(received)}}, (err, friends) => {
          resolve(friends);
        });
      });
  });
};

const sendRequest = (senderId, receiverId) => {
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
const acceptRequest = (acceptorId, senderId) => {};
const denyRequest = (denierId, senderId) => {};
const removeFriend = (removerId, senderId) => {};

module.exports = {
  getFriends,
  getSentRequests,
  getReceivedRequests,
  sendRequest,
  acceptRequest,
  denyRequest,
  removeFriend
};
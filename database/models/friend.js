const axios = require('axios').create({
  baseURL: process.env.API_HOST,
  timeout: 1000
});

const getFriends = (userId) => {
  return axios.get(`/user/${userId}/friends`).then(({data}) => data);
};

const getSentRequests = (userId) => {
  return axios.get(`/user/${userId}/friends/requests/sent`).then(({data}) => data);
};

const getReceivedRequests = (userId) => {
  return axios.get(`/user/${userId}/friends/requests/received`).then(({data}) => data);
};

const getAll = async (userId) => {
  const friends = await getFriends(userId);
  const sent = await getSentRequests(userId);
  const received = await getReceivedRequests(userId);
  return { friends, sent, received };
};

const addUser = (senderId, receiverId) => {
  return axios.put(`/user/${senderId}/friends/${receiverId}`).then(({data}) => data);
};

const removeUser = (senderId, receiverId) => {
  return axios.put(`/user/${senderId}/friends/${receiverId}`).then(({data}) => data);
};

module.exports = {
  getFriends,
  getSentRequests,
  getReceivedRequests,
  getAll,
  addUser,
  removeUser
};
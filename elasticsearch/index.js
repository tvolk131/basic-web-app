const elasticSearch = require('elasticsearch');
const db = require('../database');
const index = process.env.ELASTICSEARCH_INDEX.toLowerCase();
const client = elasticSearch.Client({
  host: process.env.ELASTICSEARCH_HOST,
  log: 'error'
});

const indexData = ({type, id, data}) => {
  return new Promise((resolve, reject) => {
    client.create({index, type, id, body: data}, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

const deleteData = ({type, id}) => {
  return new Promise((resolve, reject) => {
    client.delete({index, type, id}, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

const search = (data) => {
  return new Promise((resolve, reject) => {
    client.search({...data, index}, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

const cleanObj = (obj) => {
  let cleanedObj = {
    ...obj
  };
  if (cleanedObj._id) {
    cleanedObj.id = cleanedObj._id;
    delete cleanedObj._id;
  }
  return cleanedObj;
};

const init = () => {
  db.on('User.create', (user) => (indexData({type: 'user', id: user.id, data: cleanObj(user)})));
  db.on('User.setName', (user) => (indexData({type: 'user', id: user.id, data: cleanObj(user)})));
};

module.exports = {
  indexData,
  deleteData,
  search,
  init
};
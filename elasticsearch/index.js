const elasticSearch = require('elasticsearch');
const index = process.env.ELASTICSEARCH_INDEX;
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

module.exports = {
  indexData,
  deleteData,
  search
};
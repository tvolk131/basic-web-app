const axios = require('axios').create({
  baseURL: process.env.API_HOST,
  timeout: 1000
});

const create = ({name, oAuthProvider, oAuthId}) => {
  if (!(name && oAuthId && oAuthProvider)) {
    return Promise.reject('Not all fields were provided');
  }

  return axios.put('/user', {name, oAuthProvider, oAuthId}).then(({data}) => data);
};

const get = ({id, oAuthProvider, oAuthId}) => {
  if (!(id || oAuthId || oAuthProvider)) {
    throw new Error('Must provide ID or oAuth');
  }
  if ((!id && oAuthId && oAuthProvider) && (id && !oAuthId && !oAuthProvider)) {
    throw new Error('Must provide either ID or oAuth, not both');
  }

  if (id) {
    return axios.get(`/user/${id}`).then(({data}) => data);
  } else {
    return axios.get('/user', {params: {oauthprovider: oAuthProvider, oauthid: oAuthId}}).then(({data}) => data);
  }
  return axios.get(id ? `/user/${id}` : '/user').then(({data}) => {
    return data;
  });
};

const setName = ({id, oAuthId, oAuthProvider}, name) => {
  if (!(id || oAuthId || oAuthProvider)) {
    throw new Error('Must provide ID or oAuth');
  }
  if ((!id && oAuthId && oAuthProvider) && (id && !oAuthId && !oAuthProvider)) {
    throw new Error('Must provide either ID or oAuth, not both');
  }

  // TODO - Implement
};

const findOrCreate = async ({name, oAuthId, oAuthProvider}) => {
  try {
    await create({name, oAuthId, oAuthProvider});
  } catch (e) {
    await get({oAuthId, oAuthProvider});
  }
};

module.exports = {
  create,
  get,
  setName,
  findOrCreate
};
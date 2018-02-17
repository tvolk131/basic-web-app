require('dotenv').config();

const fs = require('fs');
const port = process.env.PORT;
const Hapi = require('hapi');
const server = new Hapi.Server({port});

const html = fs.readFileSync(`${__dirname}/../client/dist/index.html`).toString();
const vendor = fs.readFileSync(`${__dirname}/../client/dist/vendor.js`).toString();
const bundle = fs.readFileSync(`${__dirname}/../client/dist/bundle.js`).toString();

server.route([
  {
    method: 'GET',
    path: '/{any*}',
    handler: (request, reply) => {
      let user = {};
      let friends = [];
      let requestsSent = [];
      let requestsReceived = [];
      return `<script>window.__PRELOADED_STATE__ = {global: {user: ${JSON.stringify(user)}}, friend: {friends: ${JSON.stringify(friends)}, requestsSent: ${JSON.stringify(requestsSent)}, requestsReceived: ${JSON.stringify(requestsReceived)}}}</script>` + html;
    }
  },
  {
    method: 'GET',
    path: '/vendor.js',
    handler: (request, reply) => {
      return vendor;
    }
  },
  {
    method: 'GET',
    path: '/bundle.js',
    handler: (request, reply) => {
      return bundle;
    }
  }
]);

const io = require('socket.io')(server.listener);

server.start().then(() => { console.log(`Server is running on port ${port}`); });
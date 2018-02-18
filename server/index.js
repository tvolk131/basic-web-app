require('dotenv').config();
if (!['development', 'test', 'production'].includes(process.env.NODE_ENV)) {
  throw new Error('NODE_ENV must be either development, test, or production');
}

const fs = require('fs');
const html = fs.readFileSync(`${__dirname}/../client/dist/index.html`).toString();
const vendor = fs.readFileSync(`${__dirname}/../client/dist/vendor.js`).toString();
const bundle = fs.readFileSync(`${__dirname}/../client/dist/bundle.js`).toString();
const password = process.env.SESSION_SECRET;
const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT;
const db = require('../database');
const jwt = require('jsonwebtoken');
const Hapi = require('hapi');
const server = new Hapi.Server();
server.connection({port, host: 'localhost'});

server.register(require('bell'), (err) => {
  server.auth.strategy('google', 'bell', {
    provider: 'google',
    password,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    location: server.info.uri,
    isSecure: isProduction
  });

  server.state('session', {
    isSecure: isProduction,
    encoding: 'base64json',
    path: '/'
  });

  server.route({
    method: 'GET',
    path: '/auth/google',
    config: {
      auth: {
        strategy: 'google',
        mode: 'try'
      },
      handler: async (request, reply) => {
        if (!request.auth.isAuthenticated) {
          return reply('Authentication failed due to: ' + request.auth.error.message);
        }

        // Account lookup/registration
        const userData = {
          name: request.auth.credentials.profile.displayName,
          oAuthId: request.auth.credentials.profile.id,
          oAuthProvider: request.auth.credentials.provider
        };
        await db.User.findOrCreate(userData);
        delete userData.name;
        const token = jwt.sign(userData, password, {
          expiresIn: 10
        });

        return reply.redirect('/').state('session', token);
      }
    }
  });
});

server.route([
  {
    method: 'GET',
    path: '/{any*}',
    handler: async (request, reply) => {
      let user = null;
      let friends = [];
      let requestsSent = [];
      let requestsReceived = [];

      let tokenData;
      try {
        tokenData = jwt.verify(request.state.session, password);
      } catch (err) {
        // Token has expired or does not exist
      }
      if (tokenData) {
        user = await db.User.get({oAuthId: tokenData.oAuthId, oAuthProvider: tokenData.oAuthProvider});
        friends = await db.Friend.getFriends(user.id);
        requestsSent = await db.Friend.getSentRequests(user.id);
        requestsReceived = await db.Friend.getReceivedRequests(user.id);
      }
      
      reply(`<script>window.__PRELOADED_STATE__ = {global: {user: ${JSON.stringify(user)}}, friend: {friends: ${JSON.stringify(friends)}, requestsSent: ${JSON.stringify(requestsSent)}, requestsReceived: ${JSON.stringify(requestsReceived)}}}</script>` + html);
    }
  },
  {
    method: 'GET',
    path: '/vendor.js',
    handler: (request, reply) => {
      reply(vendor);
    }
  },
  {
    method: 'GET',
    path: '/bundle.js',
    handler: (request, reply) => {
      reply(bundle);
    }
  },
  {
    method: 'GET',
    path: '/logout',
    handler: (request, reply) => {
      reply.redirect('/login').unstate('session');
    }
  }
]);

const io = require('socket.io')(server.listener);

server.start().then(() => { console.log(`Server is running on port ${port}`); });
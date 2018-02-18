require('dotenv').config();

const fs = require('fs');
const html = fs.readFileSync(`${__dirname}/../client/dist/index.html`).toString();
const vendor = fs.readFileSync(`${__dirname}/../client/dist/vendor.js`).toString();
const bundle = fs.readFileSync(`${__dirname}/../client/dist/bundle.js`).toString();

const port = process.env.PORT;
const Hapi = require('hapi');
const server = new Hapi.Server();
server.connection({port, host: 'localhost'});

server.register({
  register: require('yar'),
  options: {
    cookieOptions: {
      password: 'thisisapasswordthisisapasswordthisisapassword',
      isSecure: false
    }
  }
});

server.register(require('bell'), (err) => {
  server.auth.strategy('google', 'bell', {
    provider: 'google',
    password: 'thisisapasswordthisisapasswordthisisapassword',
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    location: server.info.uri,
    isSecure: false
  });

  server.route({
    method: 'GET',
    path: '/auth/google',
    config: {
      auth: {
        strategy: 'google',
        mode: 'try'
      },
      handler: (request, reply) => {
        if (!request.auth.isAuthenticated) {
          return reply('Authentication failed due to: ' + request.auth.error.message);
        }
        // TODO - Account lookup/registration
        request.yar.set('user', {id: request.auth.credentials.profile.id, provider: request.auth.credentials.provider});
        return reply.redirect('/');
      }
    }
  });
});

server.route([
  {
    method: 'GET',
    path: '/{any*}',
    handler: (request, reply) => {
      console.log(request.yar.get('user'));
      console.log(request.auth);
      let user = null;
      let friends = [];
      let requestsSent = [];
      let requestsReceived = [];
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
      request.yar.reset();
      reply.redirect('/login');
    }
  }
]);

const io = require('socket.io')(server.listener);

server.start().then(() => { console.log(`Server is running on port ${port}`); });
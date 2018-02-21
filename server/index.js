require('dotenv').config();
if (!['development', 'test', 'production'].includes(process.env.NODE_ENV)) {
  throw new Error('NODE_ENV must be either development, test, or production');
}

const getToken = ({oAuthId, oAuthProvider}) => {
  if (!(oAuthId && oAuthProvider)) {
    throw new Error('Missing parameters');
  }
  return jwt.sign({oAuthId, oAuthProvider}, password, {
    expiresIn: parseInt(process.env.JWT_TIMEOUT_SECONDS)
  });
};

const fs = require('fs');
const html = fs.readFileSync(`${__dirname}/../client/dist/index.html`).toString();
const vendor = fs.readFileSync(`${__dirname}/../client/dist/vendor.js`).toString();
const bundle = fs.readFileSync(`${__dirname}/../client/dist/bundle.js`).toString();

const password = process.env.SESSION_SECRET;
const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT;
const cookieName = 'session';

const socketHandler   = require('./socketHandler');
const db              = require('../database');
const jwt             = require('jsonwebtoken');
const Hapi            = require('hapi');

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

  server.state(cookieName, {
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
        return reply.redirect('/').state(cookieName, getToken(userData));
      }
    }
  });
});

server.register({
  register: require('hapi-graphql'),
  options: {
    query: {
      schema: require('./graphql'),
      graphiql: !isProduction,
      pretty: !isProduction
    },
    route: {
      path: '/graphql',
      config: {}
    }
  }
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
        tokenData = jwt.verify(request.state[cookieName], password);
        const secondsToExp = tokenData.exp - Math.floor(Date.now() / 1000);
        if (secondsToExp <= process.env.JWT_TIMEOUT_SECONDS - process.env.JWT_MIN_REFRESH_DELAY_SECONDS) {
          reply.state(cookieName, getToken(tokenData));
        }
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
      reply.redirect('/login').unstate(cookieName);
    }
  }
]);

const io = require('socket.io')(server.listener);

io.use(async (socket, next) => {
  if (socket.handshake.headers.cookie) {
    let cookie = socket.handshake.headers.cookie;
    cookie = cookie
      .split('; ')
      .find(cookie => cookie.startsWith(`${cookieName}=`));
    if (cookie) {
      cookie = cookie.split(`${cookieName}=`)[1];
      cookie = Buffer.from(cookie, 'base64').toString();
      cookie = cookie.substring(1, cookie.length - 1);
      try {
        socket.request.user = await db.User.get(jwt.verify(cookie, password));
      } catch (e) {
        socket.request.user = null;
      }
    }
  }
  next();
});

io.on('connection', (socket) => {
  socketHandler.openSocket(socket);
  socket.on('disconnect', () => {
    socketHandler.closeSocket(socket);
  });
});

server.start().then(() => { console.log(`Server is running on port ${port}`); });
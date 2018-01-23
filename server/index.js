require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const db = require('../database');
const url = require('url');
const path = require('path');
const apiRouter = require('./apiRoutes');
const cookieParser = require('cookie-parser');
const authRouter = require('./authRouter.js');
const passportSocketIo = require('passport.socketio');
const socketHandler = require('./socketHandler.js');
const compression = require('compression');
const session = require('express-session');
const graphQLSchema = require('./graphql');
const expressGraphQL = require('express-graphql');
const secret = process.env.SESSION_SECRET;


const shouldCompress = (req, res) => {
  if (req.headers['x-no-compression']) {
    // Don't compress responses with this request header
    return false;
  }
  return compression.filter(req, res);
};

// Initialize elasticsearch middleware
require('../elasticsearch').init();

// Initialize passport strategies
require('./auth')(db.User);

let app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

app.use(compression({filter: shouldCompress}));

// ---- MIDDLEWARE ----
// Body parser
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser());
// Passport and sessions
app.use(session({
  store: db.store,
  secret,
  resave: true,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Setup auth and api routing
app.use('/graphql', expressGraphQL((request, response, graphQLParams) => (
  {schema: graphQLSchema, graphiql: !(process.env.NODE_ENV === 'production')}
)));
app.use('/api', apiRouter(socketHandler));
app.use('/', authRouter); // Middleware redirector

// Serve static files
app.get('*/bundle.js', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/../client/dist/bundle.js'));
});
app.get('*/vendor.js', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/../client/dist/vendor.js'));
});
app.get('/*', (req, res) => {
  if (req.user) {
    db.Friend.getAll(req.user.id)
      .then(({sent, received, friends}) => {
        res.render('index', {
          user: JSON.stringify(req.user),
          friends: JSON.stringify(friends),
          requestsSent: JSON.stringify(sent),
          requestsReceived: JSON.stringify(received)
        });
      });
  } else {
    res.render('index', {
      user: JSON.stringify(null),
      friends: JSON.stringify([]),
      requestsSent: JSON.stringify([]),
      requestsReceived: JSON.stringify([])
    });
  }
});

let http = require('http').Server(app);
let io = require('socket.io')(http);

// Setup passport authentication for web sockets
io.use(passportSocketIo.authorize({
  key: 'connect.sid',
  secret,
  store: db.store,
  passport,
  cookieParser
}));

// Setup socket event handlers
io.on('connection', (socket) => {
  socketHandler.openSocket(socket);
  socket.on('disconnect', () => {
    socketHandler.closeSocket(socket);
  });
});

// Launch/export server
if (module.parent) {
  module.exports = http;
} else {
  let port = process.env.PORT || 3000;
  http.listen(port, () => {
    console.log('Listening on port ' + port);
  });
}
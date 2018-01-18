require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const db = require('../database');
const store = db.store;
const url = require('url');
const path = require('path');
const apiRouter = require('./apiRoutes');
const cookieParser = require('cookie-parser');
const authRouter = require('./authRouter.js');
const passportSocketIo = require('passport.socketio');
const socketHandler = require('./socketHandler.js');
const compression = require('compression');
const session = require('express-session');

const shouldCompress = (req, res) => {
  if (req.headers['x-no-compression']) {
    // Don't compress responses with this request header
    return false;
  }
  return compression.filter(req, res);
};

// Initialize passport strategies
require('./auth')(db.User.model);

// Sync database
db.connection.sync().then(() => {
  console.log('Nice! Database looks fine.');
}).catch((err) => {
  console.log('Uh oh. something went wrong connecting to the database.');
  console.error(err);
});

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
  store,
  secret: 'thisisasecret',
  resave: true,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Setup auth and api routing
app.use('/api', apiRouter(socketHandler));
app.use('/', authRouter); // Middleware redirector

// Serve static files
app.get('*/bundle.js', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/../client/dist/bundle.js'));
});
app.get('/*', (req, res) => {
  res.render('index', {user: JSON.stringify(req.user || null)});
});

let http = require('http').Server(app);
let io = require('socket.io')(http);

// Setup passport authentication for web sockets
io.use(passportSocketIo.authorize({
  key: 'connect.sid',
  secret: 'thisisasecret',
  store,
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
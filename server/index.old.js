require('dotenv').config();

const express = require('express');
const passport = require('passport');
const db = require('../database');
const authRouter = require('./authRouter.js');
const passportSocketIo = require('passport.socketio');
const socketHandler = require('./socketHandler.js');

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
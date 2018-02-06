let sockets = {};

module.exports.openSocket = (socket) => {
  console.log('A user has connected');
  if (socket.request.user.id) {
    sockets[socket.request.user.id] = sockets[socket.request.user.id] || [];
    sockets[socket.request.user.id].push(socket);
  }
};

module.exports.closeSocket = (socket) => {
  console.log('A user has disconnected');
  if (socket.request.user.id) {
    for (let i = 0; i < sockets[socket.request.user.id].length; i++) {
      if (sockets[socket.request.user.id][i] === socket) {
        sockets[socket.request.user.id].splice(i, 1);
        if (sockets[socket.request.user.id].length === 0) {
          delete sockets[socket.request.user.id];
          break;
        }
      }
    }
  }
};

module.exports.respondToUsersById = (userIds, dataType, data) => {
  for (let i = 0; i < userIds.length; i++) {
    // If this user has any open socket connections
    if (sockets[userIds[i]]) {
      for (let j = 0; j < sockets[userIds[i]].length; j++) {
        sockets[userIds[i]][j].emit(dataType, data);
      }
    }
  }
};

module.exports.respondToAllUsers = (dataType, data) => {
  Object.values(sockets).forEach((socketArray) => {
    socketArray.forEach((socket) => {
      socket.emit(dataType, data);
    });
  });
};

module.exports.getUsersOnline = () => {
  return Object.keys(sockets);
};
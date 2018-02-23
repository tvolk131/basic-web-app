class SocketHandler {
  constructor() {
    this.sockets = {};
  }

  openSocket(socket) {
    if (socket.request.user) {
      console.log('A user has connected');
      this.sockets[socket.request.user.id] = this.sockets[socket.request.user.id] || [];
      this.sockets[socket.request.user.id].push(socket);
    }
  }

  closeSocket(socket) {
    if (socket.request.user) {
      const userId = socket.request.user.id;
      for (let i in this.sockets[userId]) {
        if (this.sockets[userId][i] === socket) {
          this.sockets[userId].splice(i, 1);
          if (this.sockets[userId].length === 0) {
            delete this.sockets[userId];
          }
          console.log('A user has disconnected');
          return;
        }
      }
      throw new Error('Socket is not registered with this handler');
    }
  }

  respondToUsersById(userIds, dataType, data) {
    for (let i = 0; i < userIds.length; i++) {
      // If this user has any open socket connections
      if (this.sockets[userIds[i]]) {
        for (let j = 0; j < this.sockets[userIds[i]].length; j++) {
          this.sockets[userIds[i]][j].emit(dataType, data);
        }
      }
    }
  }

  respondToAllUsers(dataType, data) {
    Object.values(this.sockets).forEach((socketArray) => {
      socketArray.forEach((socket) => {
        socket.emit(dataType, data);
      });
    });
  }

  getUsersOnline() {
    return Object.keys(this.sockets);
  }
}

module.exports = new SocketHandler();
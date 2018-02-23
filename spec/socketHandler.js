const { expect } = require('chai').use(require('chai-as-promised'));
const SocketHandler = require('../server/socketHandler').constructor;

class StubbedSocket {
  constructor(id = 'testId') {
    this.request = { user: { id } };
    this.messages = [];
  }

  emit(dataType, data) {
    this.messages.push({dataType, data});
  }
}

let handler;

describe('SocketHandler', () => {
  beforeEach(() => {
    handler = new SocketHandler();
  });

  it('Should open a socket without throwing an error', () => {
    let socket = new StubbedSocket();
    handler.openSocket(socket);
  });

  it('Should show users online', () => {
    expect(handler.getUsersOnline()).to.eql([]);
    let socketOne = new StubbedSocket('1');
    let socketTwo = new StubbedSocket('2');
    handler.openSocket(socketOne);
    expect(handler.getUsersOnline()).to.eql([socketOne.request.user.id]);
    handler.openSocket(socketTwo);
    expect(handler.getUsersOnline()).to.eql([socketOne.request.user.id, socketTwo.request.user.id]);
    handler.closeSocket(socketOne);
    expect(handler.getUsersOnline()).to.eql([socketTwo.request.user.id]);
  });

  it('Should handle adding two sockets belonging to the same user', () => {
    expect(handler.getUsersOnline()).to.eql([]);
    let socketOne = new StubbedSocket('1');
    let socketTwo = new StubbedSocket('1');
    handler.openSocket(socketOne);
    expect(handler.getUsersOnline()).to.eql([socketOne.request.user.id]);
    handler.openSocket(socketTwo);
    expect(handler.getUsersOnline()).to.eql([socketOne.request.user.id]);
    handler.closeSocket(socketOne);
    expect(() => handler.closeSocket(socketOne)).to.throw('Socket is not registered with this handler');
    expect(handler.getUsersOnline()).to.eql([socketTwo.request.user.id]);
    handler.closeSocket(socketTwo);
    expect(handler.getUsersOnline()).to.eql([]);
    expect(() => handler.closeSocket(socketOne)).to.throw('Socket is not registered with this handler');
  });
});
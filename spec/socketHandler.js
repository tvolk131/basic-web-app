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

  it('Should send data to specific users', () => {
    handler.respondToAllUsers('data', {foo: 'bar'});
    let socketOne = new StubbedSocket('1');
    let socketTwo = new StubbedSocket('1');
    let socketThree = new StubbedSocket('2');
    let socketFour = new StubbedSocket('2');
    handler.openSocket(socketOne);
    handler.openSocket(socketTwo);
    handler.openSocket(socketThree);
    handler.openSocket(socketFour);
    const dataOne = {foo: 'bar'};
    const dataTwo = {hello: 'world'};
    handler.respondToUsersById(['1'], 'dataOne', dataOne);
    handler.respondToUsersById(['1', '2'], 'dataTwo', dataTwo);
    expect(socketOne.messages).to.eql([{dataType: 'dataOne', data: dataOne}, {dataType: 'dataTwo', data: dataTwo}]);
    expect(socketTwo.messages).to.eql([{dataType: 'dataOne', data: dataOne}, {dataType: 'dataTwo', data: dataTwo}]);
    expect(socketThree.messages).to.eql([{dataType: 'dataTwo', data: dataTwo}]);
    expect(socketFour.messages).to.eql([{dataType: 'dataTwo', data: dataTwo}]);
  });

  it('Should send data to all users', () => {
    handler.respondToAllUsers('data', {foo: 'bar'});
    let sockets = [];
    for (let i = 0; i < 10; i++) {
      let socket = new StubbedSocket('' + i);
      sockets.push(socket);
      handler.openSocket(socket);
    }
    handler.respondToAllUsers('data2', {foo: 'bar'});
    for (let i in sockets) {
      expect(sockets[i].messages.length).to.equal(1);
      expect(sockets[i].messages[0]).to.eql({dataType: 'data2', data: {foo: 'bar'}});
    }
  });
});
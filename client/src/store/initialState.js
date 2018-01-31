import io from 'socket.io-client';
const socket = io();

export default {
  global: {
    ...window.__PRELOADED_STATE__.global,
    socket,
    statusMessage: '',
    statusVisible: false
  },
  friend: {
    ...window.__PRELOADED_STATE__.friend
  }
};
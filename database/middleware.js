const middleware = {};

const on = (fnName, middlewareFn) => {
  if (!middleware[fnName]) {
    middleware[fnName] = [];
  }
  middleware[fnName].push(middlewareFn);
};

const execMiddleware = (fnName, data) => {
  if (!middleware[fnName]) {
    return Promise.resolve();
  }
  return Promise.all(middleware[fnName].map((fn) => (fn())))
    .then(() => { return data; });
};

module.exports = { on, execMiddleware };
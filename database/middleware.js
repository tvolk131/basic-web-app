const middleware = {};

const on = (fnName, middlewareFn) => {
  if (!middleware[fnName]) {
    middleware[fnName] = [];
  }
  middleware[fnName].push(middlewareFn);
};

const execMiddleware = (fnName, data) => {
  if (!middleware[fnName]) {
    return Promise.resolve(data);
  }
  return Promise.all(middleware[fnName].map((fn) => (fn(data))))
    .then(() => { return data; });
};

module.exports = { on, execMiddleware };
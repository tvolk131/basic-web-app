const elastic = require('../../elasticsearch');

module.exports = (socketHandler) => {
  let router = require('express').Router();

  // Returns data about the user who sent this request
  router.get('/currentuser', (req, res) => {
    if (req.user) {
      let currentUser = req.user;
      delete currentUser.password;
      res.json(currentUser || null);
    } else {
      res.status(500).send('Not logged in');
    }
  });

  router.get('/search', (req, res) => {
    elastic.search(req.body)
      .then((data) => { res.send(data); })
      .catch((err) => { res.status(500).send(err); });
  });

  router.get('/*', (req, res) => {
    res.status(500).send('Invalid api request');
  });

  return router;
};
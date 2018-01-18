const passport = require('passport');

module.exports = (userModel) => {
  let User = userModel;
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.get({id}).then((user) => {
      if (user) {
        done(null, user);
      } else {
        done(null, null);
      }
    });
  });
};
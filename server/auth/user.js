const passport = require('passport');

module.exports = (userModel) => {
  let User = userModel;
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
      if (user) {
        done(null, user.get());
      } else {
        done(null, null);
      }
    });
  });
};
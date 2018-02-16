const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

let GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
let GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
let callbackURL = process.env.callbackURL;

if (!GOOGLE_CLIENT_ID) {
  throw new Error('Missing Google OAuth client ID in .env');
}
if (!GOOGLE_CLIENT_SECRET) {
  throw new Error('Missing Google OAuth client secret in .env');
}
if (!GOOGLE_CLIENT_ID) {
  throw new Error('Missing Google OAuth callback URL in .env');
}


module.exports = (userModel) => {
  let User = userModel;
  passport.use(new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: callbackURL,
      passReqToCallback: true
    },
    (reqest, token, refreshToken, profile, done) => {
      process.nextTick(() => {
        User.get({oAuthProvider: 'google', oAuthId: profile.id})
          .then((user) => {
            return done(null, user);
          })
          .catch((err) => {
            User.create({
              name: profile.name.givenName + ' ' + profile.name.familyName,
              oAuthProvider: 'google',
              oAuthId: profile.id
            })
              .then((newUser) => {
                return done(null, newUser);
              })
              .catch((err) => {
                return done(err);
              });
          });
      });
    }
  ));
};
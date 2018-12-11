const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const User = require('../../db/models/User');

const {GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, COOKIE_SECRET} = require('../.env');

module.exports = auth;

function auth(app) {
  passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github"
  },
    async function(accessToken, refreshToken, profile, done) {
      try {
        const oauthProvider = 'github';
        const userProviderId = profile.id;
        let user = await User.query().findOne({oauthProvider, userProviderId});
        if( ! user ) {
          const {username} = profile;
          const avatarUrl = profile.photos[0].value;
          user = await User.query().insert({oauthProvider, userProviderId, username, avatarUrl});
        }
        done(null, {userProviderId, oauthProvider});
      } catch(err) {
        console.error(err);
        done(err);
      }
    }
  ));

  // We don't user passport's serialization
  // Instead we retrive the user from the db at wildcard endpoints
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  passport.deserializeUser(async function(user, done) {
    done(null, user);
  });

  app.use(require('body-parser').urlencoded({ extended: true }));
  app.use(require('cookie-parser')());
  app.use(require('cookie-session')({ secret: COOKIE_SECRET}));

  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/auth/github/failed', (req, res) => {res.send('Something went wrong while logging with GitHub');});
  app.get('/auth/github',
    passport.authenticate('github', { failureRedirect: '/auth/github/failed' }),
    (req, res) => {res.redirect('/');},
  );
}

const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const User = require('../../db/models/User');

module.exports = auth();

function auth() {
  const GITHUB_CLIENT_ID = '3c81714764dde8e268e1';

  const GITHUB_CLIENT_SECRET = (
    '00b3e6dde42cadb2ffc88a'+
    // At least we it less accessible to crawlers
    975197.4979704999/Math.PI.toPrecision(8)+
    'ab9840fc2339'
  );

  passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
    async function(accessToken, refreshToken, profile, done) {
      try {
        console.log(accessToken);
        console.log(refreshToken);
        console.log(profile);
        const oauthProvider = 'github';
        const providerId = profile.id;
        let user = await User.query().where({oauthProvider, providerId});
        if( ! user ) {
          const {avatar_url: avatarUrl, username, accessToken, refreshToken} = profile;
          user = await User.query().insert({oauthProvider, providerId, username, avatarUrl, accessToken, refreshToken});
        }
        done(null, user);
      } catch(err) {
        done(err);
      }
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(async function(id, done) {
    try {
      const user = await User.query().where({id: user.id});
      done(null, user);
    } catch(err) {
      done(err);
    }
  });

  app.get('/auth/github', passport.authenticate('github'));

  app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/auth/github/failed' }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/');
    }
  );

  return passport;
}


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
        const providerId = profile.id;
        let user = await User.query().findOne({oauthProvider, providerId});
        if( ! user ) {
          const {username, accessToken, refreshToken} = profile;
          const avatarUrl = profile.photos[0].value;
          user = await User.query().insert({oauthProvider, providerId, username, avatarUrl, accessToken, refreshToken});
        }
        /*
        console.log(accessToken);
        console.log(refreshToken);
        console.log(profile);
        console.log(user, user.id);
        */
        done(null, user);
      } catch(err) {
        console.error(err);
        done(err);
      }
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(async function(id, done) {
    let query = User.query().findOne({id});
    let user;
    try {
      user = await query;
    } catch(err) {
      console.error(err);
      done(err);
      return;
    }
    /*
    console.log(query.toString());
    console.log(user);
    */
    done(null, user);
  });

  app.use(require('serve-static')(__dirname + '/../../public'));
  app.use(require('cookie-parser')());
  app.use(require('body-parser').urlencoded({ extended: true }));
//app.use(require('express-session')({ secret: COOKIE_SECRET, resave: true, saveUninitialized: true }));
  app.use(require('cookie-session')({ secret: COOKIE_SECRET}));
  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/auth/github/failed', (req, res) => {res.send('Something went wrong while logging with GitHub');});
  app.get('/auth/github',
    passport.authenticate('github', { failureRedirect: '/auth/github/failed' }),
    // Successful authentication
    (req, res) => {res.redirect('/');},
  );

  return passport;
}


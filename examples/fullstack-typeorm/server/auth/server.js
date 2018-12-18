module.exports = {getAuthRequestHandlers};

function getAuthRequestHandlers({databaseInterface, SECRET_KEY}) {
  const assert_internal = require('reassert/internal');
  const assert_usage = require('reassert/usage');
  const assert_warning = require('reassert/warning');

  const cookie = require('cookie');
  const cookieSignature = require('cookie-signature');
  const parseUri = require('@brillout/parse-uri');
  const readAuthCookie = require('./readAuthCookie');

  return [
    {
      paramHandler: loggedUserParamHandler,
    },
    {
      requestHandler: authReqsHandler,
    },
  ];

  function loggedUserParamHandler({req}) {
      const cookieString = req.headers.cookie;

      const parsedInfo = readAuthCookie({cookieString});

      if( ! parsedInfo ) {
          return null;
      }

      let {loggedUser, authCookie} = parsedInfo;

   // console.log(loggedUser, cookieString);

      const validation = cookieSignature.unsign(authCookie, SECRET_KEY);
      assert_internal(validation===false || validation===authCookie.split('.').slice(0, -1).join('.'));
      if( ! validation ) {
          return null;
      }

      assert_internal(loggedUser.constructor===Object);
      return {loggedUser};
  }

  async function authReqsHandler({req, payload}) {
      const url = parseUri(req.url);

      const authResponse = await authStrategy({url, req, payload});
      assert_usage(authResponse===null || Object.keys(authResponse).length>0, authResponse);
      if( authResponse===null ) {
          return null;
      }
      const {loggedUser, redirect, authError} = authResponse;

      if( authError ) {
        assert_internal(authError.constructor===String);
        return {body: authError};
      }

      assert_internal(loggedUser && loggedUser.id, authResponse);
      assert_internal(redirect, authResponse);

      const timestamp = new Date().getTime();

      const authVal = cookieSignature.sign(loggedUser.id+'.'+timestamp, SECRET_KEY);

      const cookieVal = cookie.serialize('auth', authVal, {
          maxAge: 60 * 60 * 24 * 7, // 1 week
          path: '/',
          // TODO-LATER make `httpOnly` true
       // httpOnly: true,
          sameSite: 'strict',
       // secure: true,
      });

      const headers = [
          {
              name: 'Set-Cookie',
              value: cookieVal,
          },
      ];

      const body = JSON.stringify(loggedUser);

      return {body, headers, redirect};
  }

  async function authStrategy({url, req, payload}) {
      const isSignin = url.pathname==='/auth/signin';
      const isSignup = url.pathname==='/auth/signup';

      if( ! isSignin && ! isSignup ) {
          return null;
      }

      payload = payload || await getBodyPayload(req, url);
      const userProps = payload;
      assert_internal('username' in userProps && 'password' in userProps && Object.keys(userProps).length===2, userProps);

      if( isSignin ) {
          const {objects} = await databaseInterface.runQuery({
            queryType: 'read',
            modelName: 'User',
            filter: userProps,
          });
          assert_internal(objects.length<=1, objects, userProps);
          const [user] = objects;

          if( user ) {
              return {loggedUser: user, redirect: '/'};
          } else {
              return {authError: 'Wrong login information'};
          }
      }

      if( isSignup ) {
          const {objects} = await databaseInterface.runQuery({
            queryType: 'write',
            modelName: 'User',
            object: userProps,
          });
          assert_internal(objects.length<=1);
          const [newUser] = objects;
          if( ! newUser ) {
            return {authError: "Couldn't save new user"};
          }
          return {loggedUser: newUser, redirect: '/'};
      }
  }
}

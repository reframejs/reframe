const Bell = require('bell');
const AuthCookie = require('hapi-auth-cookie');

const {GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, COOKIE_SECRET} = require('../.env');

module.exports = auth;

async function auth(server) {
  await server.register(AuthCookie);
  server.auth.strategy('session', 'cookie', {
    password: COOKIE_SECRET,
    /*
    mode: 'try',
    */
    isSecure: false,
  });

  await server.register(Bell);
  server.auth.strategy('github', 'bell', {
    provider: 'github',
    password: COOKIE_SECRET,
    clientId: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    scope: [],
    ttl: 420*1000,
    isSecure: false
  });

	server.route({
		method: ['GET', 'POST'],
		path: '/auth/github',
		options: {
			auth: 'github',
			handler: function (request, h) {

				if (!request.auth.isAuthenticated) {
					return `Authentication failed due to: ${request.auth.error.message}`;
				}

        console.log(request.auth);

        const {username, id} = request.auth.credentials.profile;
        request.cookieAuth.set({
          username,
          id,
        });

				return h.redirect('/');
			}
		}
	});
}

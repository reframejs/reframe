const Bell = require('bell');

const {GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, COOKIE_SECRET} = require('../.env');

module.exports = auth;

async function auth(server) {
  await server.register(Bell);

  server.auth.strategy('github', 'bell', {
    provider: 'github',
    password: COOKIE_SECRET,
    clientId: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
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

        console.log(auth);

				return h.redirect('/');
			}
		}
	});
}

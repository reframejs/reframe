const Koa = require('koa');
const etag = require('koa-etag');
const conditional = require('koa-conditional-get');
const config = require('@brillout/reconfig').getConfig({configFileName: 'reframe.config.js'});

const {symbolSuccess, colorEmphasis} = require('@brillout/cli-theme');

module.exports = startServer();

async function startServer() {
	let port = 3000
	const server = new Koa();

//configure custom middleware
//server.use(middleware())

//configure custom routes
    server.use(conditional());
    server.use(etag());

    server.use(config.koaIntegrationPlugin.routes);

	server.listen(port);

	console.log([
		symbolSuccess,
		'Server running ',
		'(for '+colorEmphasis(process.env.NODE_ENV||'development')+')',
	].join(''));

	return server;
}
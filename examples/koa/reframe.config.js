const koaServer = require('@reframe/koa');

module.exports = {
	$plugins: [
        require('@reframe/react-kit'),
		require('@reframe/koa')
	]
};

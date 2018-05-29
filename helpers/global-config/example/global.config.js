const config = require('..');
const assert = require('reassert');

require('./server-plugin');

config.$addConfig({
    routes: [
        {url: '/', body: '<div>Landing Page</div>'},
        {url: '/about', body: '<div>About Page</div>'},
    ],
});

assert(config.serverPort===3000);
assert(config.routes[0].url==='/');
assert(config.routes[1].url==='/about');
assert(config.routes.length===2);

config.$addConfig({
    serverPort: 8000,
    routes: [
        {url: '/test', body: '<div>Test Page</div>'},
    ],
});

assert(config.serverPort===8000);
assert(config.routes[0].url==='/');
assert(config.routes[1].url==='/about');
assert(config.routes[2].url==='/test');
assert(config.routes.length===3);

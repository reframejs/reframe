const config = require('..');

require('./plugins/server');
require('./plugins/webpack');

config.$addConfig({
    webpackConfigModifier: config
});

config.$addGetter({
    prop: 'serverPort',
    getter: configs => {
        return configs.find(serverPort
    },
});


assert(config.serverPort===3000);
assert(config.webpackConfigModifier.serverPort===3000);

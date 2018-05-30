const assert = require('reassert');
const reconfig = require('..');

const config = reconfig.getConfig({configFileName: 'custom-name.config.js'});

console.log(JSON.stringify(config, null, 2));
console.log(config.$configFile);
console.log(config.$getPluginList());

assert(config.serverPort===8000);
assert(config.routes[0].url==='/about');
assert(config.routes[1].url==='/');
assert(config.routes.length===2);

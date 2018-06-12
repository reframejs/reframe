const $name = require('./package.json').name;
const $getters = require('@reframe/path-to-regexp/getters');
const routerFile = require.resolve('./router');

module.exports = {
    $name,
    $getters,
    routerFile,
    browserConfigs: ['routerFile'],
};

const $name = require('./package.json').name;
const $getters = require('./getters');
const routerFile = require.resolve('./router');

module.exports = {
    $name,
    $getters,
    routerFile,
    browserConfigs: ['routerFile'],
};

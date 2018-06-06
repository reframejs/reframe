const {transparentGetter, requireFileGetter} = require('@brillout/reconfig/getters');

module.exports = [
    transparentGetter('routerFile'),
    requireFileGetter('routerFile', 'router'),
];

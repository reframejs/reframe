const {transparentGetter, eagerRequireFileGetter} = require('@brillout/reconfig/utils');

module.exports = [
    transparentGetter('routerFile'),
    eagerRequireFileGetter('routerFile', 'router'),
];

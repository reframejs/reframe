process.on('unhandledRejection', err => {throw err});
const log = require('reassert/log');
const build = require('@rebuild/build');
const webpackConfig = require('./webpack.config');

(async () => {
    const dist_info = await build(webpackConfig, {
        log: true,
    });
    log('Compilation of hello wolrd example done.');
    log(dist_info);
})();

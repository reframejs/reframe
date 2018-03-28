process.on('unhandledRejection', err => {throw err});
const log = require('reassert/log');
const serve = require('@rebuild/serve');
const webpackConfig = require('./webpack.config');

(async () => {
    const dist_info = await serve(webpackConfig, {
        log: true,
    });
    log('Serving of hello world example done.');
    log(dist_info);
})();

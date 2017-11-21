const webpackConfig = require('./webpack.config');
const serve = require('@rebuild/serve');
const isCli = require.main === module;
const serveBrowserAssets = opts => serve(webpackConfig, {log: true, ...opts});
if( isCli ) {
    serveBrowserAssets();
} else {
    module.exports = {serveBrowserAssets};
}

const webpackConfig = require('./webpack.config');
const build = require('@rebuild/build');
const buildPromise = build(webpackConfig);
module.exports = buildPromise;

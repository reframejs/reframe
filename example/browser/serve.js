const webpackConfig = require('./webpack.config');
const Rebuild = require('@rebuild/serve');
Rebuild.serve(webpackConfig);

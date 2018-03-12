const {StandardConfig, StandardNodeConfig} = require('./StandardConfig');
const ReactConfig = require('./ReactConfig');
const Config = require('./Config');

module.exports = Config;
Object.assign(module.exports, {Config, StandardConfig, StandardNodeConfig, ReactConfig});

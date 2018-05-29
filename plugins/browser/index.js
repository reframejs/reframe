const globalConfig = require('@brillout/global-config');
const {transparentGetter} = require('@brillout/global-config/utils');

globalConfig.$addConfig({
    $name: require('./package.json').name,
    browserEntryFile: require.resolve('./browserEntry'),
});
globalConfig.$addGetter(transparentGetter('browserEntryFile'));

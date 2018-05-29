const globalConfig = require('@brillout/global-config');

globalConfig.$addConfig({
    $name: require('./package.json').name,
    browserViewWrapperFile: require.resolve('./browserViewWrapper'),
    nodejsViewWrapperFile: require.resolve('./nodejsViewWrapper'),
});

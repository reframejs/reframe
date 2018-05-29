const globalConfig = require('@brillout/global-config');

globalConfig.$addConfig({
    $name: require('./package.json').name,
    routerFile: require.resolve('./router'),
});

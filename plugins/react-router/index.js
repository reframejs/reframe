const $name = require('./package.json').name;
const $getters = require('./getters');

globalConfig.$addConfig({
    $name,
    $getters,
    browserViewWrapperFile: require.resolve('./browserViewWrapper'),
    nodejsViewWrapperFile: require.resolve('./nodejsViewWrapper'),
});

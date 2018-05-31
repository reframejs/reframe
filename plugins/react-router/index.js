const $name = require('./package.json').name;
const $getters = require('./getters');

module.exports = {
    $name,
    $getters,
    browserViewWrapperFile: require.resolve('./browserViewWrapper'),
    nodejsViewWrapperFile: require.resolve('./nodejsViewWrapper'),
};

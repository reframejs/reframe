const $name = require('./package.json').name;
const $getters = require('./getters');

module.exports = {
    $name,
    $getters,

    nodejsViewWrapperFile: require.resolve('./nodejsViewWrapper'),

    browserViewWrapperFile: require.resolve('./browserViewWrapper'),
    browserConfigFiles: [
        {
            configPath: 'browserViewWrapperFile',
            configIsList: true,
        }
    ],
};

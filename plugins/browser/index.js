const {transparentGetter} = require('@brillout/reconfig/utils');
const $name = require('./package.json').name;
const $getters = [
    transparentGetter('browserEntryFile'),
];

module.exports = {
    $name,
    $getters,
    browserEntryFile: require.resolve('./browserEntry'),
};

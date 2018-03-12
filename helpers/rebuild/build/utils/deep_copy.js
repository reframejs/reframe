const _ = require('lodash');

module.exports = deep_copy;

function deep_copy(obj) {
    return _.merge({}, obj);
}

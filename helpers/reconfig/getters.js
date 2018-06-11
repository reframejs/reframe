const assert_usage = require('reassert/usage');

module.exports = {
    transparentGetter,
    lazyRequireFileGetter,
    requireFileGetter,
};

// TODO-LATER - show usage error when trying to access a missing config
//  - tell the user what is the plugin that defines the getter

function transparentGetter(prop) {
    return {
        prop,
        getter: configParts => {
            return findLast(configParts, prop);
        },
    };
}

function lazyRequireFileGetter(propOld, prop) {
    return {
        prop,
        getter: configParts => {
            const filePath = findLast(configParts, propOld);
            return filePath && (() => require(filePath));
        },
    };
}

function requireFileGetter(propOld, prop) {
    if( ! prop ) {
        const suffix = 'File';
        assert_usage(propOld.endsWith(suffix));
        prop = propOld.slice(0, -suffix.length);
    }
    return {
        prop,
        getter: configParts => {
            const filePath = findLast(configParts, propOld);
            return filePath && require(filePath);
        },
    };
}

function findLast(configParts, prop) {
    for(let i=configParts.length-1; i>=0; i--) {
        const configPart = configParts[i];
        if( prop in configPart ) {
            return configPart[prop];
        }
    }
}

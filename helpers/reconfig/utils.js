// TODO rename this file `standard-getters`

module.exports = {
    transparentGetter,
    requireFileGetter,
    eagerRequireFileGetter,
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

function requireFileGetter(propOld, prop) {
    return {
        prop,
        getter: configParts => {
            const filePath = findLast(configParts, propOld);
            return filePath && (() => require(filePath));
        },
    };
}

function eagerRequireFileGetter(propOld, prop) {
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

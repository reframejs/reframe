module.exports = {
    transparentGetter,
    requireFileGetter,
    eagerRequireFileGetter,
};

function transparentGetter(prop) {
    return {
        prop,
        getter: configParts => configParts.find(configPart => configPart[prop])[prop],
    };
}

function requireFileGetter(propOld, prop) {
    return {
        prop,
        getter: configParts => {
            const filePath = configParts.find(configPart => configPart[propOld])[propOld];
            return () => require(filePath);
        },
    };
}

function eagerRequireFileGetter(propOld, prop) {
    return {
        prop,
        getter: configParts => {
            const filePath = configParts.find(configPart => configPart[propOld])[propOld];
            return require(filePath);
        },
    };
}

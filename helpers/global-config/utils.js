module.exports = {
    transparentGetter,
};

function transparentGetter(prop) {
    return {
        prop,
        getter: configParts => configParts.find(configPart => configPart[prop]),
    };
}

module.exports = [
    {
        prop: 'browserViewWrapperFiles',
        getter: configParts => (
            configParts
            .map(configPart => configPart['browserViewWrapperFile'])
            .filter(Boolean)
        ),
    },
    {
        prop: 'nodejsViewWrappers',
        getter: configParts => (
            configParts
            .map(configPart => configPart['nodejsViewWrapperFile'])
            .filter(Boolean)
            .map(filePath => require(filePath))
        ),
    },
];

module.exports = [
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

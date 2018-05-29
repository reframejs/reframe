const globalConfig = require('@brillout/global-config');

[
    'browserEntryFile',
    'renderToDomFile',
    'routerFile',
].forEach(prop => {
    globalConfig.$addGetters({
        prop,
        getter: configParts => configParts.find(configPart => configPart[prop]),
    });
});

globalConfig.$addGetters({
    'browserViewWrapperFiles',
    getter: configParts => configParts.map(configPart => configPart['browserViewWrapperFile']).filter(Boolean),
});

// TODO move somewhere else
globalConfig.$addGetters({
    'nodejsViewWrapperFiles',
    getter: configParts => configParts.map(configPart => configPart['nodejsViewWrapperFile']).filter(Boolean),
});


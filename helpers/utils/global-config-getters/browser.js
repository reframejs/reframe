const globalConfig = require('@brillout/global-config');

[
    'browserEntryFile',
    'renderToDomFile',
    'routerFile',
    'viewWrapperFile',
].forEach(prop => {
    globalConfig.$addGetters({
        prop,
        getter: configParts => configParts.find(configPart => configPart[prop]),
    });
});

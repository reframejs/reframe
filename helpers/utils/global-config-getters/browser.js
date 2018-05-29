const globalConfig = require('@brillout/global-config');
const {transparentGetter} = require('@brillout/global-config/utils');

[
    'renderToDomFile',
    // TODO move because also required for nodejs?
    'routerFile',
].forEach(prop => {
    globalConfig.$addGetter(transparentGetter(prop));
});

globalConfig.$addGetter({
    prop: 'browserViewWrapperFiles',
    getter: configParts => configParts.map(configPart => configPart['browserViewWrapperFile']).filter(Boolean),
});

// TODO move somewhere else
globalConfig.$addGetter({
    prop: 'nodejsViewWrapperFiles',
    getter: configParts => configParts.map(configPart => configPart['nodejsViewWrapperFile']).filter(Boolean),
});


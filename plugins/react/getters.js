const {transparentGetter, eagerRequireFileGetter} = require('@brillout/reconfig/utils');

module.exports = [
    eagerRequireFileGetter('renderToHtmlFile', 'renderToHtml'),
    transparentGetter('renderToDomFile'),
];

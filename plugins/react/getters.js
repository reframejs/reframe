const {transparentGetter, requireFileGetter} = require('@brillout/reconfig/getters');

module.exports = [
    requireFileGetter('renderToHtmlFile', 'renderToHtml'),
    // TODO remove browser config file transparent getters
    transparentGetter('renderToDomFile'),
];

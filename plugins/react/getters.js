const {transparentGetter, requireFileGetter} = require('@brillout/reconfig/getters');

module.exports = [
    requireFileGetter('renderToHtmlFile', 'renderToHtml'),
    transparentGetter('renderToDomFile'),
];

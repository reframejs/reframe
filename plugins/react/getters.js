const {transparentGetter} = require('@brillout/reconfig/utils');

module.exports = [
    transparentGetter('renderToHtml'),
    transparentGetter('renderToDomFile'),
];

import buildScript from './build-script.mjs';
import buildHtml from './build-html.mjs';

process.on('unhandledRejection', err => {throw err});

buildScript();
buildHtml();

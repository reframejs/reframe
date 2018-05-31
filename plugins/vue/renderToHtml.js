const VueServerRenderer = require('vue-server-renderer');
const generateHtml = require('@brillout/index-html');
const containerId = 'root-vue';

module.exports = renderToHtml;

async function renderToHtml({pageConfig, initialProps}) {
    const renderer = VueServerRenderer.createRenderer();

    const contentHtml = await renderer.renderToString(pageConfig.view);

    const html = renderHtmlDocument(contentHtml, pageConfig);

    return html;
}

function renderHtmlDocument(contentHtml, pageConfig) {
    const htmlOptions = Object.assign({bodyHtmls: []}, pageConfig);
    htmlOptions.bodyHtmls.push('<div id="'+containerId+'">'+contentHtml+'</div>');

    const html = generateHtml(htmlOptions);

    return html;
}

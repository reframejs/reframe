const {getInitialProps} = require('./common');
const generateHtml = require('@brillout/index-html');

module.exports = {renderPageHtml};

async function renderPageHtml({renderToHtml, pageConfig, url, router}) {
    const initialProps = await getInitialProps({pageConfig, url, router});

    let html;
    try {
        html = await renderToHtml({pageConfig, initialProps});
    } catch(err) {
        console.log();
        console.log();
        console.error(err);
        console.log();
        console.log();
        html = renderHtmlError({pageConfig, err});
    }

    return html;
}

function renderHtmlError({pageConfig, err}) {
    const errHtml = (
`<pre><code>${err.toString()}</code></pre>`
);

    const htmlOptions = Object.assign({bodyHtmls: []}, pageConfig);
    htmlOptions.bodyHtmls.push('<div>'+errHtml+'</div>');
    const html = generateHtml(htmlOptions);

    return html;
}


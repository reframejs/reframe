const express = require('express');

const reconfig = require('@brillout/reconfig');
const {symbolSuccess} = require('@brillout/cli-theme');
const getPageHtml = require('@brillout/repage/getPageHtml');

const reframeConfig = reconfig.getConfig({configFileName: 'reframe.config.js'});

startExpressServer();

async function startExpressServer() {
    const app = express();

    // Server static assets
    const {staticAssetsDir} = reframeConfig.getBuildInfo();
    app.use(express.static(staticAssetsDir, {extensions: ['html']}));

    app.get('/hello-from-express', function (req, res) {
        res.send('Hello from Express');
    });

    // Render pages to HTML
    app.get('*', async function(req, res, next) {
        const html = await getHtml(req);

        if( ! html ) {
            next();
            return;
        }
        res.send(html);
    });

    app.listen(3000, function () {
        console.log(symbolSuccess+'Express server listening on port 3000');
    });
}

async function getHtml(req) {
    const uri = req.url;
    const requestContext = req;

    const {pageConfigs} = reframeConfig.getBuildInfo();

    const {renderToHtml, router} = reframeConfig;

    const html = await getPageHtml({pageConfigs, uri, renderToHtml, router, requestContext});

    return html;
}

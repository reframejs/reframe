import Hapi from 'hapi';
import buildAll from './build-all.mjs';
import ReframeServer from '@reframe/server';

process.on('unhandledRejection', err => {throw err});

startServer();

async function build({onBuild}) {
    const {pages, browserDistPath} = await buildAll();
    onBuild({pages, browserDistPath});
}

function getHapiPlugins() {
    return (
        ReframeServer.getReframeHapiPlugins({
            build,
        })
    );
}

async function startServer() {
    const server = Hapi.Server({port: 3000});

    const {HapiServerRendering, HapiServeBrowserAssets} = await getHapiPlugins();
    await server.register([
        {plugin: HapiServeBrowserAssets},
        {plugin: HapiServerRendering},
    ]);

    await server.start();
    console.log(`Server running at ${server.info.uri}`);
}

import Hapi from 'hapi';
import buildAll from './build-all.mjs';
import getHapiPlugins from '@reframe/server/getHapiPlugins';
/* TODO
import getProjectConfig from '@reframe/utils/getProjectConfig';
import HapiPluginServerRendering from '@reframe/server/HapiPluginServerRendering';
import HapiPluginStaticAssets from '@reframe/server/HapiPluginStaticAssets';
*/

process.on('unhandledRejection', err => {throw err});

startServer();

async function build({onBuild}) {
    const {pages, browserDistPath} = await buildAll();
    onBuild({pages, browserDistPath});
}

async function startServer() {
    const server = Hapi.Server({port: 3000});

    const {HapiPluginReframe} = await getHapiPlugins({build})
    await server.register([
        {plugin: HapiPluginReframe},
    ]);

    await server.start();
    console.log(`Server running at ${server.info.uri}`);
}

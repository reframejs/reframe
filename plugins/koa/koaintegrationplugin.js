'use strict';
const compose = require('koa-compose');
const Router = require('koa-router');
const router = new Router();
const reconfig = require('@brillout/reconfig');

module.exports = {
    name: 'koaIntegrationPluginFile',
    multiple: false,
    routes: routes(),
};

function routes() {
	return compose(
	[
		router.routes(),
		router.allowedMethods()
	]
	)
}

router.get('*', async(ctx, next) => {

    const {body, headers} = await getResponse(ctx);

    if (body === null) {
        ctx.status = 404;
        return;
    }
    headers.forEach(header => ctx.set(header.name, header.value));
    ctx.body = body;
})
async function getResponse(ctx) {
    let {body, headers} = await applyConfigHandlers(ctx);
    return {body, headers};
}

async function applyConfigHandlers(ctx) {
    const config = reconfig.getConfig({configFileName: 'reframe.config.js'});
    return await config.applyRequestHandlers(ctx.request);
}




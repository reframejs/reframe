'use strict';
const compose = require('koa-compose');
const Router = require('koa-router');
const ETag = require('koa-etag');
const assert_internal = require('reassert/internal');
const router = new Router();
const reconfig = require('@brillout/reconfig');

module.exports = middleware();

function middleware() {
	return compose(
	[
		router.routes(),
		// Add middleware here
	]
	)
}

router.get('*', async(ctx, next) => {

    const {body, headers, etag} = await getResponse(ctx);

    if( body === null ) return next();

    headers.forEach(header => ctx.set(header.name, header.value));
    if( etag ) {
        ctx.set('ETag', etag);
        ctx.status = 200;
        if (ctx.fresh) {
            ctx.status = 304;
            return;
        }
    }
    ctx.body = body;
})
async function getResponse(ctx) {
    let {body, headers} = await applyConfigHandlers(ctx);

    if( body === null ) return {body: null};

    let etag;
    headers = (
        headers
        .filter(header => {
            if( header.name==='etag' ) {
                etag = header.value;
                assert_internal(etag[0]==='"' && etag.slice(-1)[0]==='"', etag);
                etag = etag.slice(1, -1);
                return false;
            }
            return true;
        })
    );
    return {body, headers, etag};
}

async function applyConfigHandlers(ctx) {
    const config = reconfig.getConfig({configFileName: 'reframe.config.js'});
    return await config.applyRequestHandlers(ctx.request);
}




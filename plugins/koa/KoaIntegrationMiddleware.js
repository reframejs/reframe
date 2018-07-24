const Router = require('koa-router');
const config = require('@brillout/reconfig').getConfig({configFileName: 'reframe.config.js'})
const assert_internal = require('reassert/internal');

module.exports = getRoutes();

function getRoutes() {
    const router = new Router();

    router.get('*', async (ctx, next) => {
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
    });

    return router.routes();
}

async function getResponse(ctx) {
    let {body, headers} = await applyConfigHandlers(ctx);

    if( body === null ) return {body: null};

    let etag;
    headers = (
        headers
        .filter(header => {
            if( header.name==='ETag' ) {
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
    return await config.applyRequestHandlers(ctx.request);
}

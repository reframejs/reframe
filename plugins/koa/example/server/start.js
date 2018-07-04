const Koa = require('koa')
const Router = require('koa-router');
const config = require('@brillout/reconfig').getConfig({configFileName: 'reframe.config.js'});
const {symbolSuccess, colorEmphasis} = require('@brillout/cli-theme');

module.exports = start()

async function start () {
    const server = new Koa();

    server.listen(3000);

    server.use(config.koaIntegration);

    const router = new Router();
    router.get('/hello-from-koa', (ctx, next) => {
        ctx.body = 'Hello from Koa';
    });
    server.use(router.routes());

    const env = colorEmphasis(process.env.NODE_ENV||'development');
    console.log(symbolSuccess+'Server running (for '+env+')');

    return server
}

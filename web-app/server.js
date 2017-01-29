// @flow
const Koa = require('koa');
const serve = require('koa-static');
const convert = require('koa-convert');
const koaBodyParser = require('koa-bodyparser');
const historyApiFallback = require('koa-connect-history-api-fallback');
const KoaRouter = require('koa-router');

const app = new Koa();

app.use(convert(historyApiFallback({
    verbose: false,
})));

app.use(serve('static'));

app.use(koaBodyParser());
(async function test() {
    console.log('FUCK');
    await 1;
    console.log('FUCK2');
    throw new Error();
})().catch(error => console.log(error));

const router = new KoaRouter();
app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
app.listen(port, undefined, undefined, function () {
    const env = process.env.NODE_ENV || '--- not set ---';
    console.log('NODE_ENV=' + env);
    console.log(`Listening at localhost:${port}`);
});

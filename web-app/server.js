// @flow
import 'source-map-support/register';

import Koa from 'koa';
import serve from 'koa-static';
import convert from 'koa-convert';
import koaBodyParser from 'koa-bodyparser';
import historyApiFallback from 'koa-connect-history-api-fallback';
import KoaRouter from 'koa-router';

const app = new Koa();

app.use(convert(historyApiFallback({
    verbose: true,
})));
app.use(serve('static'));
app.use(koaBodyParser());

const router = new KoaRouter();
app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
app.listen(port, undefined, undefined, function () {
    const env = process.env.NODE_ENV || '--- not set ---';
    console.log('NODE_ENV=' + env);
    console.log(`Listening at localhost:${port}`);
});

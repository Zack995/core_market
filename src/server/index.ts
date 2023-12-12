import appConfig from 'config';
import Koa from 'koa';
import koaBody from 'koa-body';
import Router from '@koa/router';
import lock from './lock';
import cors from './cors';

const app = new Koa();
const router = new Router();
const pkg = require('../../package.json');

app.use(koaBody());
// ====== router ======
router.get('/', async ctx => {
  ctx.body = ctx.body || 'Hello ' + pkg.name + '@' + pkg.version;
});
lock(router);
cors(router);

app.use(router.routes()).use(router.allowedMethods());

const port = appConfig.PORT || 8000;
const server = app.listen(port, () => {
  console.info('app started, port: ' + port);
});
export default server;

const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const createRouter = require('./router');
const constants = require('./constants');

app.use(async (ctx,next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = err.message;
    if (err.status == 500) {
      ctx.app.emit('error', err, ctx);
    }
  }
});

app.use(bodyParser());

const appSecret = process.env.APP_SECRET || 'app-secret';
const tokenExpSeconds = process.env.TOKEN_EXP || '1h';
const env = process.env.NODE_ENV || constants.prodEnv;
const dbConnectionString = process.env.DATABASE_URL;
const router = createRouter(appSecret, tokenExpSeconds, env, dbConnectionString);

app.use(router.routes());
app.use(router.allowedMethods());

app.on('error', (err) => {
  console.log(err);
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`webserver started on port ${port}`);
});

module.exports = server;
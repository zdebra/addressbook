const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const setupHandlers = require('./handlers');

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

const appSecret = process.env.APP_SECRET || 'app-secret';
const tokenExpSeconds = process.env.TOKEN_EXP || '1h';

app.use(bodyParser());
setupHandlers(app, appSecret, tokenExpSeconds);

app.on('error', (err) => {
  console.log(err);
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`webserver started on port ${port}`);
});

module.exports = server; // for testing
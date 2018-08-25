const route = require('koa-route');
const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const UserController = require('./users/controller');
const UserStorage = require('./users/storage');

app.use(bodyParser());

app.use(async (ctx,next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = err.message;
    ctx.app.emit('error', err, ctx);
  }
});

const userStorage = new UserStorage();
const userCtrl = new UserController(userStorage, null);
app.use(route.post("/users", async (ctx) => {
  await userCtrl.registerAccount(ctx);
}));

app.on('error', (err) => {
  console.log(err);
});

const port = process.env.PORT || 3000;
console.log("webserver started on port", port);
app.listen(port);
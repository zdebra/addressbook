const route = require('koa-route');
const UserController = require('./users/controller');
const UserStorage = require('./users/storage');

function setup(app, appSecret, tokenExpSeconds) {
    const userStorage = new UserStorage();
    const userCtrl = new UserController(userStorage, null, appSecret, tokenExpSeconds);

    app.use(route.post("/users", async (ctx) => {
        const body = ctx.request.body;
        const user = await userCtrl.registerAccount(body.email, body.password);
        ctx.body = user.short;
    }));  

    app.use(route.post("/users/login", async (ctx) => {
        const body = ctx.request.body;
        const token = await userCtrl.login(body.email,body.password);
        ctx.body = { "token": token };
    }));
}

module.exports = setup;
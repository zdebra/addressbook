const route = require('koa-route');
const UserController = require('./users/controller');
const UserStorage = require('./users/storage');
const makeContactStorage = require('./contancts/storage');
const ContactController = require('./contancts/controller');

function setup(app, appSecret, tokenExpSeconds) {
    const userStorage = new UserStorage();
    const contactStorage = makeContactStorage();
    const userCtrl = new UserController(userStorage, appSecret, tokenExpSeconds);
    const contactCtrl = new ContactController(contactStorage);

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

    app.use(route.post("/users/contact", async (ctx) => {
        const userId = "id-from-auth-middleware";
        await contactCtrl.createContact(userId, ctx.request.body);
    }));
}

module.exports = setup;
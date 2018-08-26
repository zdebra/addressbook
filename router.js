const Router = require('koa-router');
const UserController = require('./users/controller');
const UserStorage = require('./users/storage');
const makeContactStorage = require('./contancts/storage');
const ContactController = require('./contancts/controller');
const ExposedError = require('./error');
const jwt = require('jsonwebtoken');


function createRouter(appSecret, tokenExpSeconds) {
    const userStorage = new UserStorage();
    const contactStorage = makeContactStorage();
    const userCtrl = new UserController(userStorage, appSecret, tokenExpSeconds);
    const contactCtrl = new ContactController(contactStorage);

    const router = new Router();
    router.use(setUserMiddleware);

    router.post("/users", async (ctx) => {
        const body = ctx.request.body;
        const user = await userCtrl.registerAccount(body.email, body.password);
        ctx.body = user.short;
    });

    router.post("/users/login", async (ctx) => {
        const body = ctx.request.body;
        const token = await userCtrl.login(body.email,body.password);
        ctx.body = { "token": token };
    });

    router.post("/users/contact", authMiddleware, async (ctx) => {
        const userId = ctx.context.userId;
        const contact = await contactCtrl.createContact(userId, ctx.request.body);
        ctx.body = contact; 
    });

    return router;
}

 async function setUserMiddleware(ctx, next) {
    try {
        const token = jwt.verify(ctx.request.headers["auth-token"], process.env.APP_SECRET);
        if (!ctx.context) {
            ctx.context = {};
        }
        ctx.context.userId = token.id;
        ctx.context.userEmail = token.email; 
    } catch {
        // noop, no token was given
    }
    await next();
}

async function authMiddleware(ctx, next) {
    if (!ctx.context || !ctx.context.userId || !ctx.context.userEmail) {
        throw new ExposedError(401, "user not authorized");
    }  
    await next();
}

module.exports = createRouter;
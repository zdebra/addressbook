const Router = require('koa-router');
const UserController = require('./users/controller');
const makeUserStorage = require('./users/storage');
const makeContactStorage = require('./contacts/storage');
const ContactController = require('./contacts/controller');
const ExposedError = require('./error');
const jwt = require('jsonwebtoken');
const testEnv = require('./constants').testEnv;
const makeDB = require('./database');
const firebaseAdmin = require('firebase-admin');

function createRouter(appSecret, tokenExpSeconds, env, connectionString, firebaseConfig) {
    let postgresDB, firebaseDB;
    if (env != testEnv) {
        postgresDB = makeDB(connectionString);

        firebaseAdmin.initializeApp({
            credential: firebaseAdmin.credential.cert(JSON.parse(firebaseConfig)),
            databaseURL: 'https://address-book-8b54b.firebaseio.com'
        });
        firebaseDB = firebaseAdmin.database();
    }

    const userStorage = makeUserStorage(env, postgresDB);
    const contactStorage = makeContactStorage(env, firebaseDB);
    const userCtrl = new UserController(userStorage, appSecret, tokenExpSeconds);
    const contactCtrl = new ContactController(contactStorage);

    const router = new Router();
    router.use(setUserMiddleware(appSecret));

    router.post("/users", userCtrl.registerAccount());
    router.post("/users/login", userCtrl.login());
    router.post("/users/contact", authMiddleware,  contactCtrl.createContact());
    return router;
}

function setUserMiddleware(appSecret) {
    return async (ctx, next) => {
        try {
            const token = jwt.verify(ctx.request.headers["auth-token"], appSecret);
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
}

async function authMiddleware(ctx, next) {
    if (!ctx.context || !ctx.context.userId || !ctx.context.userEmail) {
        throw new ExposedError(401, "user not authorized");
    }  
    await next();
}

module.exports = createRouter;
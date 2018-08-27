const uuid = require('uuid/v4');
const jwt = require('jsonwebtoken');
const utils = require('./utils');
const User = require('./user');
const ExposedError = require('../error');

class UserController {
    constructor(storage, appSecret, tokenExpSeconds) {
        this._storage = storage;
        this._appSecret = appSecret;
        this._tokenExpSeconds = tokenExpSeconds;
    }

    registerAccount()  {
        return async (ctx) => {
            const body = ctx.request.body;
            const email = body.email;
            const password = body.password;

            if (!utils.validateEmail(email)) {
                throw new ExposedError(400,"invalid email")
            }
            if (!utils.validatePassword(password)) {
                throw new ExposedError(400 ,"invalid password: must contain at least 6 characters, one number, one lowercase and one uppercase letter");
            }

            const passwordHash = await utils.hashPassword(password);
            const user = new User(uuid(), email, passwordHash, new Date());
            await this._storage.insert(user);
            ctx.body = user.short;
        }
    }

    login() {
        return async (ctx) => {
            const body = ctx.request.body;
            const email = body.email;
            const password = body.password;

            let userFromStorage;
            try {
                userFromStorage = await this._storage.withEmail(email);
            } catch(err) {
                throw new ExposedError(404,`user ${email} doesn't exist: ${err.message}`);
            }

            const passwordMatch = await userFromStorage.passwordMatch(password);
            if (!passwordMatch) {
                throw new ExposedError(401,"invalid password");
            }
            const token = jwt.sign({ id: userFromStorage.id,email: email }, this._appSecret, {expiresIn: this._tokenExpSeconds});
            ctx.body = { "token": token };
        }
    }
}

module.exports = UserController;

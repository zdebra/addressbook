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

    async registerAccount(email, password)  {
        if (!utils.validateEmail(email)) {
            throw new ExposedError(400,"invalid email")
        }
        if (!utils.validatePassword(password)) {
            throw new ExposedError(400 ,"invalid password: must contain at least 6 characters, one number, one lowercase and one uppercase letter");
        }

        const passwordHash = await utils.hashPassword(password);
        const user = new User(uuid(), email, passwordHash, Date.now());
        await this._storage.insert(user);
        return user;
    }

    async login(email,password) {
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
        return jwt.sign({ id: userFromStorage.id,email: email }, this._appSecret, {expiresIn: this._tokenExpSeconds});
    }
}

module.exports = UserController;

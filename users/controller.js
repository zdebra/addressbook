const uuid = require('uuid/v4');
const jwt = require('jsonwebtoken');
const utils = require('./utils');
const User = require('./user');
const ExposedError = require('../error');

class UserController {
    constructor(userStorage, contactStorage, appSecret, tokenExpSeconds) {
        this._userStorage = userStorage;
        this._contactStorage = contactStorage;
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
        await this._userStorage.insert(user);
        return user;
    }

    async login(email,password) {
        let userFromStorage;
        try {
            userFromStorage = await this._userStorage.withEmail(email);
        } catch(err) {
            throw new ExposedError(404,`user ${email} doesn't exist: ${err.message}`);
        }

        const passwordMatch = await userFromStorage.passwordMatch(password);
        if (!passwordMatch) {
            throw new ExposedError(401,"invalid password");
        }
        return jwt.sign({ email: email }, this._appSecret, {expiresIn: this._tokenExpSeconds});
    }

    async createContact(userId, contact) {
        
    }
}

module.exports = UserController;

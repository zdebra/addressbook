const uuid = require('uuid/v4');
const jwt = require('jsonwebtoken');
const utils = require('./utils');
const User = require('./user');

class UserController {
    constructor(userStorage, contactStorage, appSecret, tokenExpSeconds) {
        this._userStorage = userStorage;
        this._contactStorage = contactStorage;
        this._appSecret = appSecret;
        this._tokenExpSeconds = tokenExpSeconds;
    }

    async registerAccount(email, password)  {
        if (!email) {
            throw new Error("email is required");
        }
        if (!password) {
            throw new Error("password is required");
        }

        const passwordHash = await utils.hashPassword(password);
        const user = new User(uuid(), email, passwordHash, Date.now());
        await this._userStorage.insert(user);
        return user;
    }

    async login(email,password) {
        const userFromStorage = await this._userStorage.withEmail(email);
        const passwordMatch = await userFromStorage.passwordMatch(password);
        if (!passwordMatch) {
            throw new Error("invalid password");
        }
        return jwt.sign({ email: email }, this._appSecret, {expiresIn: this._tokenExpSeconds});
    }

    async createContact(userId, contact) {
        
    }
}

module.exports = UserController;

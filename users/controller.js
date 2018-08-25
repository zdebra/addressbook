const uuid = require('uuid/v4');
const utils = require('./utils');
const User = require('./user');

class UserController {
    constructor(userStorage, contactStorage) {
        this.userStorage = userStorage;
        this._contactStorage = contactStorage;
    }

    async registerAccount(ctx)  {
        const body = ctx.request.body
        if (!body.password) {
            throw new Error("password is required");
        }
        if (!body.email) {
            throw new Error("email is required");
        }

        const passwordHash = await utils.hashPassword(body.password);
        const user = new User(uuid(), body.email, passwordHash, Date.now());
        
        await this.userStorage.insert(user);
    }

    async login(email,password) {
        return {jwt: "todo"}
    }

    async createContact(userId, contact) {
        
    }
}

module.exports = UserController;

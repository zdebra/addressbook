const constants = require('../constants');

function make(env, db) {
    if (env == constants.testEnv) {
        return new UserMemoryStorage();
    } 
    return new UserPersistStorage(db);
}

class UserMemoryStorage {
    constructor() {
        this._users = new Map();
    }

    async insert(user) {
        if (!user.isValid()) {
            throw new Error("user is invalid");
        }
        if (this._users.has(user.email)) {
            throw new Error(`user ${user.email} already exist`);
        }
        this._users.set(user.email, user);
    }

    async withEmail(email) {
        const user = this._users.get(email);
        if (!user) {
            throw new Error(`user with ${email} doesn't exist`);
        }
        return user;
    }
}

class UserPersistStorage {
    constructor(db) {
        this._db = db;
    }

    async insert(user) {
        if (!user.isValid()) {
            throw new Error("user is invalid");
        }
        
    }

    async withMail(email) {

    }

}

module.exports = make;
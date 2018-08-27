const constants = require('../constants');
const User = require('./user');

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
        console.log("inserting user", user);
        if (!user.isValid()) {
            throw new Error("user is invalid");
        }
        await this._db.query(
            'INSERT INTO users(id,email,password_hash,created_at) VALUES($1,$2,$3,$4)',
            [user.id, user.email, user.passwordHash, user.createdAt]);
    }

    async withEmail(email) {
        const resp = await this._db.query("SELECT id,email,password_hash,created_at FROM users WHERE email=$1;", [email]);
        if (resp.rows.length == 0) {
            throw new Error(`user with ${email} doesn't exist`);
        }
        const u = resp.rows[0];
        return new User(u.id, u.email, u.password_hash, u.created_at);
    }

}

module.exports = make;
const format = require('util').format;

class UserStorage {
    constructor() {
        this._users = new Map();
    }

    async insert(user) {
        console.log("insert is called", user)
        if (!user.id) {
            throw new Error("missing id attribute");
        }
        if (!user.email) {
            throw new Error("missing email attribute");
        }
        if (!user.passwordHash) {
            throw new Error("missing password hash attribute");
        }
        if (this._users.has(user.email)) {
            throw new Error(format("user %s already exist", user.email))
        }
        this._users.set(user.email, user);
    }

    async withEmail(email) {
        const user = this._users.get(email);
        if (!user) {
            throw new Error(format("user with email %s doesn't exist", email));
        }
        return user;
    }
}

module.exports = UserStorage;
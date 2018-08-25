const format = require('util').format;

class UserStorage {
    constructor() {
        this._users = [];
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
        this._users.push(user);
    
    }

    async withId(id) {
        for (let i = 0; i < this._users.length; i++) {
            if (this._users[i].id == id) {
                return this._users[i];
            }
        }
        throw new Error(format("user with id %s doesn't exist", id));
    }
}

module.exports = UserStorage;
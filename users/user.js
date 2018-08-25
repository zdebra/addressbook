const utils = require('./utils');

class User {
    constructor(id, email,passwordHash,createdAt) {
        this._id = id;
        this._email = email;
        this._passwordHash = passwordHash;
        this._createdAt = createdAt;
    }

    get id() {
        return this._id;
    }

    get email() {
        return this._email;
    }

    get passwordHash() {
        return this._passwordHash;
    }

    get createdAt() {
        return this._createdAt;
    }

    get short() {
        return {
            id: this.id,
            email: this.email,
            createdAt: this.createdAt
        }
    }

    async passwordMatch(password) {
        const match = await utils.comparePasswordWithHash(password, this._passwordHash);
        return match
    }
}



module.exports = User;
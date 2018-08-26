const constants = require('../constants');

class ContactMemoryStorage {
    constructor() {
        this._contacts = [];
    }

    async store(contact) {
        this._contacts.push(contact);
    }
}

function make(env) {
    if (env == constants.testEnv) {
        return new ContactMemoryStorage();
    }
}

module.exports = make;
const constants = require('../constants');

class ContactMemoryStorage {
    constructor() {
        this._contacts = [];
    }

    async store(contact) {
        this._contacts.push(contact);
    }
}

class ContactFirebaseStorage {
    constructor(db) {
        this._dbRef = db.ref("contacts");
    }

    async store(contact) {
        await this._dbRef.child(contact.id).set(contact.short);
    }
}

function make(env, db) {
    if (env == constants.testEnv) {
        return new ContactMemoryStorage();
    }
    return new ContactFirebaseStorage(db);
}

module.exports = make;
class ContactMemoryStorage {
    constructor() {
        this._contacts = [];
    }

    async store(contact) {
        this._contacts.push(contact);
    }
}

function make() {
    return new ContactMemoryStorage();
}

module.exports = make;
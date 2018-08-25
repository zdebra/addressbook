const utils = require('./utils');
const uuid = require('uuid/v4');
const ExposedError = require('../error');

class ContactController {
    constructor(storage) {
        this._storage = storage;
    }

    async createContact(userId, contact) {
        contact.userId = userId;
        contact.id = uuid();
        if (!utils.validContact(contact)) {
            throw new ExposedError(400, "invalid contact")
        }
        await this_.storage.store(contact);
    }
}

module.exports = ContactController;
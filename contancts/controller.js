const utils = require('./utils');
const uuid = require('uuid/v4');
const ExposedError = require('../error');

class ContactController {
    constructor(storage) {
        this._storage = storage;
    }

    createContact() {
        return async (ctx) => {
            const userId = ctx.context.userId;
            let contact = ctx.request.body;
            contact.userId = userId;
            contact.id = uuid();
            if (!utils.validContact(contact)) {
                throw new ExposedError(400, "invalid contact")
            }
            await this._storage.store(contact);
            ctx.body = contact; 
        }
    }
}

module.exports = ContactController;
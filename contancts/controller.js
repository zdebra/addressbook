const Contact = require('./contact');
const uuid = require('uuid/v4');
const ExposedError = require('../error');

class ContactController {
    constructor(storage) {
        this._storage = storage;
    }

    createContact() {
        return async (ctx) => {
            const userId = ctx.context.userId;
            const body = ctx.request.body;
            const contact = new Contact(uuid(), userId, body.name, body.address, body.phone);

            if (!contact.isValid()) {
                throw new ExposedError(400, "contact is invalid")
            }
            await this._storage.store(contact);
            ctx.body = contact.short; 
        }
    }
}

module.exports = ContactController;
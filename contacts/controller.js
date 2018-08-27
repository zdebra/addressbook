const Contact = require('./contact');
const uuid = require('uuid/v4');
const ExposedError = require('../error');

class ContactController {
    constructor(storage) {
        this._storage = storage;
    }

    /**
     * @api {post} /users/contact Create Contact
     * @apiName CreateContact
     * @apiGroup Contact
     * 
     * @apiParam {String} name Contact's name.
     * @apiParam {String} address Contact's address.
     * @apiParam {String} phone Contact's phone.
     *
     * @apiExample {curl} Example usage:
     *       curl --request POST \
     *           --url http://localhost:3000/users/contact \
     *           --header 'auth-token: <JWT-token>' \
     *           --header 'content-type: application/json' \
     *           --data '{
     *               "name": "Henry pjotr",
     *               "address": "dadasdasd",
     *               "phone": "11231231242"
     *           }'
     *
     * @apiError IvalidContact If given contact is invalid.
     * @apiError Unauthorized If request failed to authorize.
     */
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
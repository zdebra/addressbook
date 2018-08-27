const uuid = require('uuid/v4');
const jwt = require('jsonwebtoken');
const utils = require('./utils');
const User = require('./user');
const ExposedError = require('../error');

class UserController {
    constructor(storage, appSecret, tokenExpSeconds) {
        this._storage = storage;
        this._appSecret = appSecret;
        this._tokenExpSeconds = tokenExpSeconds;
    }

    /**
     * @api {post} /users Register account
     * @apiName RegisterAccount
     * @apiGroup User
     * 
     * @apiParam {String} email Email address.
     * @apiParam {String} password User pasword.
     *
     * @apiExample {curl} Example usage:
     *     curl --request POST \
     *          --url http://localhost:3000/users \
     *          --header 'content-type: application/json' \
     *          --data '{
     *              "email": "abcd@cdef.com",
     *              "password": "ABcd1234"
     *          }'
     *
     * @apiError InvalidEmail If given address is not a valid email.
     * @apiError InvalidPassword Password must contain at least 6 characters, one number, one lowercase and one uppercase letter.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 400 Bad request
     */
    registerAccount()  {
        return async (ctx) => {
            const body = ctx.request.body;
            const email = body.email;
            const password = body.password;

            if (!utils.validateEmail(email)) {
                throw new ExposedError(400,"invalid email")
            }
            if (!utils.validatePassword(password)) {
                throw new ExposedError(400 ,"invalid password: must contain at least 6 characters, one number, one lowercase and one uppercase letter");
            }

            const passwordHash = await utils.hashPassword(password);
            const user = new User(uuid(), email, passwordHash, new Date());
            await this._storage.insert(user);
            ctx.body = user.short;
        }
    }

    /**
     * @api {post} /users/login Login
     * @apiName Login
     * @apiGroup User
     * 
     * @apiParam {String} email Email address.
     * @apiParam {String} password User pasword.
     *
     * @apiExample {curl} Example usage:
     *     curl --request POST \
     *          --url http://localhost:3000/users/login \
     *          --header 'content-type: application/json' \
     *          --data '{
     *              "email": "abcd@cdef.com",
     *              "password": "ABcd1234"
     *          }'
     *
     * @apiError UserNotFound If given email address is not associated with any of user accounts.
     * @apiError InvalidPassword Password doesn't match.
     */
    login() {
        return async (ctx) => {
            const body = ctx.request.body;
            const email = body.email;
            const password = body.password;

            let userFromStorage;
            try {
                userFromStorage = await this._storage.withEmail(email);
            } catch(err) {
                throw new ExposedError(404,`user ${email} doesn't exist: ${err.message}`);
            }

            const passwordMatch = await userFromStorage.passwordMatch(password);
            if (!passwordMatch) {
                throw new ExposedError(401,"invalid password");
            }
            const token = jwt.sign({ id: userFromStorage.id,email: email }, this._appSecret, {expiresIn: this._tokenExpSeconds});
            ctx.body = { "token": token };
        }
    }
}

module.exports = UserController;

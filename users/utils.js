const bcrypt = require('bcrypt');
const saltRounds = 10;

async function hashPassword(password) {
    const passwordHash = await bcrypt.hash(password, saltRounds);
    return passwordHash;
}

async function comparePasswordWithHash(password, passwordHash) {
    const match = await bcrypt.compare(password, passwordHash);
    return match;
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validatePassword(password) {
    var re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    return re.test(password);
}

module.exports = {
    hashPassword: hashPassword,
    comparePasswordWithHash: comparePasswordWithHash,
    validateEmail: validateEmail,
    validatePassword: validatePassword
}
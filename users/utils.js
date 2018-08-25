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

module.exports = {
    hashPassword: hashPassword,
    comparePasswordWithHash: comparePasswordWithHash
}
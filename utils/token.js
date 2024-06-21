// File: utils/token.js
global.DEBUG = true; 

function generateToken(username) {
    if (global.DEBUG) console.log(`token.generateToken(${username})`);
    const timestamp = Date.now().toString();
    const token = Buffer.from(`${username}-${timestamp}`).toString('base64');
    const creationDate = new Date();
    const expirationDate = new Date(creationDate);
    expirationDate.setDate(creationDate.getDate() + 3);

    if (global.DEBUG) {
        console.debug(`Generated token for ${username}: ${token}`);
        console.debug(`Creation Date: ${creationDate.toISOString()}, Expiration Date: ${expirationDate.toISOString()}`);
    }

    return { token, creationDate: creationDate.toISOString(), expirationDate: expirationDate.toISOString() };
}

module.exports = { generateToken };

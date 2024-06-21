// File: utils/token.js
function generateToken(username) {
    const timestamp = Date.now().toString();
    const token = Buffer.from(`${username}-${timestamp}`).toString('base64');
    const creationDate = new Date();
    const expirationDate = new Date(creationDate);
    expirationDate.setDate(creationDate.getDate() + 3);
    return { token, creationDate: creationDate.toISOString(), expirationDate: expirationDate.toISOString() };
}

module.exports = { generateToken };

// File: utils/token.js
function generateToken(username) {
    const timestamp = Date.now().toString();
    const token = Buffer.from(`${username}-${timestamp}`).toString('base64');
    return token;
}

module.exports = { generateToken };

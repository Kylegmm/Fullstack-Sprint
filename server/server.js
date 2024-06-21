// File: server/server.js
global.DEBUG = true; 

const express = require('express');
const fs = require('fs');
const path = require('path');
const { generateToken } = require('../utils/token');

const app = express();
const PORT = 3000;

if (global.DEBUG) console.log('server.main()');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

const USER_RECORDS_PATH = path.join(__dirname, '..', 'data', 'user_records.json');
const LOG_PATH = path.join(__dirname, '..', 'logs', 'app.log');

app.get('/', (req, res) => {
    if (global.DEBUG) console.log('server.get("/")');
    res.render('index');
});

app.post('/generate-token', (req, res) => {
    if (global.DEBUG) console.log(`server.post("/generate-token", ${JSON.stringify(req.body)})`);
    const { username } = req.body;
    const { token, creationDate, expirationDate } = generateToken(username);
    addUserRecord(username, null, null, token, creationDate, expirationDate);
    const isExpired = isTokenExpired(expirationDate);
    res.render('token', { username, token, creationDate, expirationDate, isExpired });
    logAction(`Token generated for ${username} via web.`);

    if (global.DEBUG) {
        console.debug(`Token data: ${JSON.stringify({ username, token, creationDate, expirationDate, isExpired })}`);
    }
});

app.post('/update-email', (req, res) => {
    if (global.DEBUG) console.log(`server.post("/update-email", ${JSON.stringify(req.body)})`);
    const { username, email } = req.body;
    updateUserEmail(username, email);
    res.render('update', { message: `Email updated for ${username}` });
});

app.post('/update-phone', (req, res) => {
    if (global.DEBUG) console.log(`server.post("/update-phone", ${JSON.stringify(req.body)})`);
    const { username, phone } = req.body;
    updateUserPhone(username, phone);
    res.render('update', { message: `Phone number updated for ${username}` });
});

app.get('/token-count', (req, res) => {
    if (global.DEBUG) console.log('server.get("/token-count")');
    const records = JSON.parse(fs.readFileSync(USER_RECORDS_PATH, 'utf-8'));
    res.render('count', { count: records.length });
    logAction('Token count displayed.');
});

function addUserRecord(username, email, phone, token, creationDate, expirationDate) {
    if (global.DEBUG) console.log(`server.addUserRecord(${username}, ${email}, ${phone}, ${token}, ${creationDate}, ${expirationDate})`);
    const records = JSON.parse(fs.readFileSync(USER_RECORDS_PATH, 'utf-8'));
    const userIndex = records.findIndex(user => user.username === username);
    if (userIndex !== -1) {
        if (email) records[userIndex].email = email;
        if (phone) records[userIndex].phone = phone;
        if (token) records[userIndex].token = token;
        records[userIndex].creationDate = creationDate;
        records[userIndex].expirationDate = expirationDate;
    } else {
        records.push({ username, email, phone, token, creationDate, expirationDate });
    }
    fs.writeFileSync(USER_RECORDS_PATH, JSON.stringify(records, null, 2));
    logAction(`User record added/updated for ${username}.`);

    if (global.DEBUG) {
        console.debug(`Updated user record: ${JSON.stringify(records[userIndex] || records[records.length - 1])}`);
    }
}

function updateUserEmail(username, email) {
    if (global.DEBUG) console.log(`server.updateUserEmail(${username}, ${email})`);
    const records = JSON.parse(fs.readFileSync(USER_RECORDS_PATH, 'utf-8'));
    const userIndex = records.findIndex(user => user.username === username);
    if (userIndex !== -1) {
        records[userIndex].email = email;
        fs.writeFileSync(USER_RECORDS_PATH, JSON.stringify(records, null, 2));
        logAction(`Email updated for ${username}.`);
    } else {
        console.log(`User ${username} not found.`);
    }
}

function updateUserPhone(username, phone) {
    if (global.DEBUG) console.log(`server.updateUserPhone(${username}, ${phone})`);
    const records = JSON.parse(fs.readFileSync(USER_RECORDS_PATH, 'utf-8'));
    const userIndex = records.findIndex(user => user.username === username);
    if (userIndex !== -1) {
        records[userIndex].phone = phone;
        fs.writeFileSync(USER_RECORDS_PATH, JSON.stringify(records, null, 2));
        logAction(`Phone number updated for ${username}.`);
    } else {
        console.log(`User ${username} not found.`);
    }
}

function isTokenExpired(expirationDate) {
    if (global.DEBUG) console.log(`server.isTokenExpired(${expirationDate})`);
    const tokenDate = new Date(expirationDate);
    const currentDate = new Date();
    return currentDate > tokenDate;
}

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    logAction('Server started.');
});

function logAction(action) {
    if (global.DEBUG) console.log(`server.logAction(${action})`);
    const timestamp = new Date().toISOString();
    fs.appendFileSync(LOG_PATH, `${timestamp} - ${action}\n`);
    if (global.DEBUG) {
        console.debug(`DEBUG: ${action}`);
    }
}

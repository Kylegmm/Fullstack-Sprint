// File: server/server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const { generateToken } = require('../utils/token');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

const USER_RECORDS_PATH = path.join(__dirname, '..', 'data', 'user_records.json');
const LOG_PATH = path.join(__dirname, '..', 'logs', 'app.log');

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/generate-token', (req, res) => {
    const { username } = req.body;
    const token = generateToken(username);
    addUserRecord(username, null, null, token);
    res.render('token', { username, token });
    logAction(`Token generated for ${username} via web.`);
});

app.post('/update-email', (req, res) => {
    const { username, email } = req.body;
    updateUserEmail(username, email);
    res.render('update', { message: `Email updated for ${username}` });
});

app.post('/update-phone', (req, res) => {
    const { username, phone } = req.body;
    updateUserPhone(username, phone);
    res.render('update', { message: `Phone number updated for ${username}` });
});

app.get('/token-count', (req, res) => {
    const records = JSON.parse(fs.readFileSync(USER_RECORDS_PATH, 'utf-8'));
    res.render('count', { count: records.length });
    logAction('Token count displayed.');
});

function addUserRecord(username, email, phone, token) {
    const records = JSON.parse(fs.readFileSync(USER_RECORDS_PATH, 'utf-8'));
    const userIndex = records.findIndex(user => user.username === username);
    if (userIndex !== -1) {
        if (email) records[userIndex].email = email;
        if (phone) records[userIndex].phone = phone;
        if (token) records[userIndex].token = token;
    } else {
        records.push({ username, email, phone, token });
    }
    fs.writeFileSync(USER_RECORDS_PATH, JSON.stringify(records, null, 2));
    logAction(`User record added/updated for ${username}.`);
}

function updateUserEmail(username, email) {
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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    logAction('Server started.');
});

function logAction(action) {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(LOG_PATH, `${timestamp} - ${action}\n`);
}

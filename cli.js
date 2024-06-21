// File: cli.js
const fs = require('fs');
const path = require('path');
const { generateToken } = require('./utils/token');

const CONFIG_PATH = path.join(__dirname, 'config/config.json');
const USER_RECORDS_PATH = path.join(__dirname, 'data/user_records.json');
const LOG_PATH = path.join(__dirname, 'logs/app.log');
const HELP_FILE_PATH = path.join(__dirname, './root/help.txt');

function showHelp() {
    try {
        const helpText = fs.readFileSync(HELP_FILE_PATH, 'utf-8');
        console.log(helpText);
    } catch (error) {
        console.error('Error reading help file:', error);
    }
}

function initApp(option) {
    switch (option) {
        case '--help':
            console.log(`
Usage: myapp init <option>

myapp init --help                          displays help for the init command
myapp init --all                           creates the folder structure and the config and help files
myapp init --mk                            creates the folder structure
myapp init --cat                           creates the config file with default settings and the help files
            `);
            break;
        case '--all':
            createFolderStructure();
            createConfigFile();
            logAction('Application initialized with folder structure and config file.');
            break;
        case '--mk':
            createFolderStructure();
            logAction('Folder structure created.');
            break;
        case '--cat':
            createConfigFile();
            logAction('Config file created with default settings.');
            break;
        default:
            console.log('Invalid option for init.');
    }
}

function createFolderStructure() {
    if (!fs.existsSync(path.dirname(CONFIG_PATH))) {
        fs.mkdirSync(path.dirname(CONFIG_PATH), { recursive: true });
    }
    if (!fs.existsSync(path.dirname(USER_RECORDS_PATH))) {
        fs.mkdirSync(path.dirname(USER_RECORDS_PATH), { recursive: true });
    }
    if (!fs.existsSync(path.dirname(LOG_PATH))) {
        fs.mkdirSync(path.dirname(LOG_PATH), { recursive: true });
    }
}

function createConfigFile() {
    if (!fs.existsSync(CONFIG_PATH)) {
        fs.writeFileSync(CONFIG_PATH, JSON.stringify({ app: 'myApp', version: '1.0' }));
    }
    if (!fs.existsSync(USER_RECORDS_PATH)) {
        fs.writeFileSync(USER_RECORDS_PATH, JSON.stringify([]));
    }
}

function config(option, key, value) {
    switch (option) {
        case '--help':
            console.log(`
Usage: myapp config <option>

myapp config --help                        displays help for the config command
myapp config --show                        displays a list of the current config settings
myapp config --reset                       resets the config file with default settings
myapp config --set <option> <value>        sets a specific config setting
            `);
            break;
        case '--show':
            showConfig();
            break;
        case '--reset':
            resetConfig();
            break;
        case '--set':
            if (key && value) {
                setConfig(key, value);
            } else {
                console.log('Invalid parameters for config set.');
            }
            break;
        default:
            console.log('Invalid option for config.');
    }
}

function showConfig() {
    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    console.log(config);
    logAction('Configuration viewed.');
}

function resetConfig() {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify({ app: 'myApp', version: '1.0' }));
    logAction('Configuration reset.');
}

function setConfig(key, value) {
    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    config[key] = value;
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
    logAction(`Configuration updated: ${key} = ${value}`);
}

function token(option, ...args) {
    switch (option) {
        case '--help':
            console.log(`
Usage: myapp token <option>

myapp token --help                         displays help for the token command
myapp token --count                        displays a count of the tokens created
myapp token --new <username>               generates a token for a given username, saves tokens to the json file
myapp token --upd p <username> <phone>     updates the json entry with a new phone number
myapp token --upd e <username> <email>     updates the json entry with a new email
myapp token --search u <username>          fetches a token for a given username
myapp token --search e <email>             fetches a token for a given email
myapp token --search p <phone>             fetches a token for a given phone number
            `);
            break;
        case '--count':
            countTokens();
            break;
        case '--new':
            if (args[0]) {
                addUserRecord(args[0], null, null);
            } else {
                console.log('Username required to generate a new token.');
            }
            break;
        case '--upd':
            if (args[0] === 'p' && args[1] && args[2]) {
                updateUserPhone(args[1], args[2]);
            } else if (args[0] === 'e' && args[1] && args[2]) {
                updateUserEmail(args[1], args[2]);
            } else {
                console.log('Invalid parameters for token update.');
            }
            break;
        case '--search':
            if (args[0] && args[1]) {
                searchUserRecord(args[0], args[1]);
            } else {
                console.log('Invalid parameters for token search.');
            }
            break;
        default:
            console.log('Invalid option for token.');
    }
}

function countTokens() {
    const records = JSON.parse(fs.readFileSync(USER_RECORDS_PATH, 'utf-8'));
    console.log(`Total tokens created: ${records.length}`);
    logAction('Token count displayed.');
}

function addUserRecord(username, email, phone) {
    const records = JSON.parse(fs.readFileSync(USER_RECORDS_PATH, 'utf-8'));
    const token = generateToken(username);
    const userIndex = records.findIndex(user => user.username === username);
    if (userIndex !== -1) {
        records[userIndex] = { username, email, phone, token };
    } else {
        records.push({ username, email, phone, token });
    }
    fs.writeFileSync(USER_RECORDS_PATH, JSON.stringify(records, null, 2));
    logAction(`User record added/updated for ${username}.`);
}

function searchUserRecord(type, query) {
    const records = JSON.parse(fs.readFileSync(USER_RECORDS_PATH, 'utf-8'));
    let results;
    switch (type) {
        case 'u':
            results = records.filter(user => user.username === query);
            break;
        case 'e':
            results = records.filter(user => user.email === query);
            break;
        case 'p':
            results = records.filter(user => user.phone === query);
            break;
        default:
            console.log('Invalid search type.');
            return;
    }
    console.log(results);
    logAction(`User record searched for ${type}: ${query}.`);
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

function logAction(action) {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(LOG_PATH, `${timestamp} - ${action}\n`);
}

const [,, command, option, ...args] = process.argv;

switch (command) {
    case '--help':
        showHelp();
        break;
    case 'init':
        initApp(option);
        break;
    case 'config':
        config(option, args[0], args[1]);
        break;
    case 'token':
        token(option, ...args);
        break;
    default:
        console.log('Unknown command');
        showHelp();
}
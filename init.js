#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const express = require('express');

// Initialize commands
const createFolders = () => {
  const directories = ['config', 'data', 'logs', 'public', 'routes', 'views'];
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  });
};

const createFiles = () => {
  const files = {
    'config/default.json': JSON.stringify({}),
    'config/help.txt': 'Help content goes here...',
  };
  for (const [filePath, content] of Object.entries(files)) {
    fs.writeFileSync(filePath, content);
  }
};

const checkStatus = () => {
  const directories = ['config', 'data', 'logs', 'public', 'routes', 'views'];
  let statusReport = {};

  directories.forEach(dir => {
    statusReport[dir] = fs.existsSync(dir) ? 'Exists' : 'Missing';
  });

  const files = ['config/default.json', 'config/help.txt'];
  files.forEach(file => {
    statusReport[file] = fs.existsSync(file) ? 'Exists' : 'Missing';
  });

  console.log('Status Report:', statusReport);
};

const init = (option) => {
  switch (option) {
    case '--all':
      createFolders();
      createFiles();
      console.log('Application initialized with all components.');
      break;
    case '--mk':
      createFolders();
      console.log('Folder structure created.');
      break;
    case '--cat':
      createFiles();
      console.log('Configuration and help files created.');
      break;
    case '--status':
      checkStatus();
      break;
    default:
      console.log('Invalid option for init command.');
      break;
  }
};

// Configuration commands
const showConfig = () => {
  const config = JSON.parse(fs.readFileSync('config/default.json'));
  console.log(config);
};

const resetConfig = () => {
  const defaultConfig = {};
  fs.writeFileSync('config/default.json', JSON.stringify(defaultConfig));
  console.log('Configuration reset to default.');
};

const setConfig = (option, value) => {
  const config = JSON.parse(fs.readFileSync('config/default.json'));
  config[option] = value;
  fs.writeFileSync('config/default.json', JSON.stringify(config));
  console.log(`Configuration option ${option} set to ${value}.`);
};

const config = (option, value) => {
  switch (option) {
    case '--show':
      showConfig();
      break;
    case '--reset':
      resetConfig();
      break;
    case '--set':
      setConfig(process.argv[4], process.argv[5]);
      break;
    default:
      console.log('Invalid option for config command.');
      break;
  }
};

// Token commands
const generateToken = (username) => {
  const token = `token-${Math.random().toString(36).substr(2)}`;
  let data = {};
  if (fs.existsSync('data/tokens.json')) {
    data = JSON.parse(fs.readFileSync('data/tokens.json'));
  }
  data[username] = token;
  fs.writeFileSync('data/tokens.json', JSON.stringify(data));
  console.log(`Token for ${username}: ${token}`);
};

const updateUser = (field, username, value) => {
  let data = {};
  if (fs.existsSync('data/tokens.json')) {
    data = JSON.parse(fs.readFileSync('data/tokens.json'));
  }
  if (data[username]) {
    data[username][field] = value;
    fs.writeFileSync('data/tokens.json', JSON.stringify(data));
    console.log(`${field} for ${username} updated to ${value}.`);
  } else {
    console.log(`User ${username} not found.`);
  }
};

const searchUser = (field, value) => {
  if (fs.existsSync('data/tokens.json')) {
    const data = JSON.parse(fs.readFileSync('data/tokens.json'));
    for (const [username, details] of Object.entries(data)) {
      if (details[field] === value) {
        console.log(`User found: ${username}`);
        return;
      }
    }
    console.log('User not found.');
  } else {
    console.log('No user data available.');
  }
};

const token = (option, username, value) => {
  switch (option) {
    case '--new':
      generateToken(username);
      break;
    case '--upd':
      const field = process.argv[4] === 'p' ? 'phone' : 'email';
      updateUser(field, username, value);
      break;
    case '--search':
      const searchField = process.argv[4];
      searchUser(searchField, username);
      break;
    default:
      console.log('Invalid option for token command.');
      break;
  }
};

// Main switch for commands
const command = process.argv[2];
const option = process.argv[3];

switch (command) {
  case 'init':
    init(option);
    break;
  case 'config':
    config(option);
    break;
  case 'token':
    token(option, process.argv[4], process.argv[5]);
    break;
  default:
    console.log('Unknown command');
    break;
}

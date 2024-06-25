# TokenWebCLI

## Overview

TokenWebCLI is a full-stack JavaScript application that includes a web server and a command-line interface (CLI) for managing user tokens. The project uses Node.js and Express to serve a web interface and handle various token-related operations. The CLI provides commands to initialize the application, configure settings, and manage user tokens.

## Features

- **Web Server**: Serves HTML pages with forms for generating tokens and updating user information.
- **Command-Line Interface (CLI)**: Allows initialization, configuration, and management of user tokens.
- **Token Management**: Generates tokens with creation and expiration dates, updates user email and phone, and searches for tokens.
- **Directory Structure Initialization**: Creates necessary directories and configuration files.

## Directory Structure

The project's directory structure is as follows:

```
/tokenmanager
├── config
│   └── config.json
├── data
│   └── user_records.json
├── logs
│   └── app.log
├── public
│   └── style.css
├── server
│   ├── views
│   │   ├── index.ejs
│   │   ├── token.ejs
│   │   ├── update.ejs
│   │   └── count.ejs
│   └── server.js
├── utils
│   └── token.js
├── cli.js
├── help.txt
└── package.json
```

## Installation

1. Clone the repository

2. Install the dependencies:
   ```sh
   npm install
   ```

## Usage

### Initialize the Application

Use the CLI to initialize the application. This will create the necessary directory structure and configuration files.

```sh
node cli.js init --all
```

### Configuration

Show the current configuration:

```sh
node cli.js config --show
```

Reset the configuration to default values:

```sh
node cli.js config --reset
```

Set a specific configuration value:

```sh
node cli.js config --set <key> <value>
```

### Token Management

Generate a new token for a user:

```sh
node cli.js token --new <username>
```

Update a user's email:

```sh
node cli.js token --upd e <username> <email>
```

Update a user's phone number:

```sh
node cli.js token --upd p <username> <phone>
```

Search for a token by username:

```sh
node cli.js token --search u <username>
```

Search for a token by email:

```sh
node cli.js token --search e <email>
```

Search for a token by phone number:

```sh
node cli.js token --search p <phone>
```

### Web Server

Start the web server:

```sh
node server/server.js
```

Open your browser and navigate to `http://localhost:3000` to access the web interface. The web interface includes forms for generating tokens, updating user information, and viewing token counts.

## Debug Mode

To enable debug mode, set `global.DEBUG = true` at the top of `cli.js` and `server.js`. This will enable detailed logging for debugging purposes.

## Contributing

Feel free to submit issues and pull requests. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License.

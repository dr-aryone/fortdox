# FortDox
FortDox is a desktop application that safely stores a teams documents and shares a team's passwords safely within the team.

# Installation
Clone the project
> git clone git@bitbucket.org:edgeguideab/fortdoks.git

Install following tools (if they are not already installed):
- [Node.js](https://nodejs.org/)
- [ElasticSearch](https://www.elastic.co/)
- [MySQL](https://www.mysql.com/)

For debugging, install following developer tools:
- [Node Inspector](https://github.com/node-inspector/node-inspector)
- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
- [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en)

## Install Node.js dependencies
Install the Node dependencies for client in `fortdoks/app`
> npm install

Install the Node dependencies for server in `fortdoks/server`
> npm install

# Getting started
Build the project with gulp in `fortdoks/app`
> gulp

## Set configuration files
Configuration files that are needed to run the application with the server.

### Client
Copy the template from `fortdoks/app/config-template.json` to `fortdoks/app/config.json` and fill in necessary values.

### Server
Copy the template from `fortdoks/server/server_modules/config-template.json` to `fortdoks/server/server_modules/config.json` and fill in necessary values.

## Client
Run the application in `fortdoks/app`
> electorn .

## Server
Run the server in `fortdoks/server`
> npm start

## ElasticSearch
Run ElasticSearch
> ElasticSearch

## Database
Run mySQL (optional)
> mysql -u root -p

Run database migrations in `fortdoks/server`
> sequelize db:migrate

# Build the Project into Runnable Application
Build the application in `fortdoks/app`
> electron-packager . --overwrite --platform=darwin --arch=x64 --out=release-build;

# Developers
## Debugging
Debugging is done on the client through the Developer Tools (`cmd + alt + I` on Mac) in the Electron window. Simply insert a debugger statement `debugger;` to trigger the developer mode. React and Redux developer tools should be visible as tabs if they are correctly installed.

Debugging is done similar to the client side. Run the inspector instead of npm start in `fordoks/server`
>nodemon --inspect main.js

## Cleanup
On server in `fortdoks/server`
> db:migrate:undo:all
> db:mmigrate

Remove indicies from ElasticSearch
> curl -XDELETE 'http://yourdomain/_all'

On client in `fortdoks/app`, remove `local_storage.json`, eg.
> rm local_storage.json

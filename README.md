# FortDox

FortDox is a desktop application that safely stores a teams documents and shares a team's passwords safely within the team.

## Permissions

In FortDox some actions are restricted by permissions. At the time of writing these actions and their corresponding permission code are:

- GRANT PERMISSION **1**, Allows a user to manages its own permissions and other users' permissions.
- DELETE DOCUMENT **2**, Allows a user to delete documents from FortDox
- REMOVE USER **4**, Allows a user to remove another user from the organization
- INVITE USER **8**, Allows a user to invite new users to the organization.

All new users gets a base permission level of `0` which basically means that they can create, search and edit documents as well as add new devices to their accounts.

The owner of the organization, i.e the user that created it, has a special status since it is the **only user** that is allowed to grant other members to become permission managers. A permission manager is a user that has the `GRANT PERMISSION` permission.

A permission level is associated with every user, it is an integer created from the bitwise OR of a users permission. E.g, the owner of the organization has a permission level of:

> Permission = `GRANT_PERMISSION` | `DELETE_DOCUMENT` | `REMOVE_USER` | `INVITE_USER` = 15.
> which in hex is `0xf` and in binary `1111`.

# Installation

Clone the project

> git clone git@github.com:edgeguide/fortdox.git

In production it can be useful to forward your own ssh agent to get access to bitbucket

**TL:DR**

- [Node.js](https://nodejs.org/)
- [ElasticSearch](https://www.elastic.co/)
- [MySQL](https://www.mysql.com/)

## [Node.js](https://nodejs.org/)

Node version 8.11.3, follow instructions [here](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)

## [ElasticSearch](https://www.elastic.co/)

_Note:_ ElasticSearch requires Java version 8+, `sudo apt-get install default-jre`

ElasticSearch version 6.3.0,
Installation Instructions [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/deb.html),
Installation path (on ubuntu at least): `/usr/share/elasticsearch/bin`
On production, use systemd or similar to manage elasticsearch as described [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/deb.html#deb-running-systemd)

_Note:_ If on startup Elasticsearch complains about not being able to allocate enough memory. Simply `sudo vim /etc/elasticsearch/jvm.options` and change

> -Xms1g --> -Xms512m  
> -Xmx1g --> -Xmx512m

## [MySQL](https://www.mysql.com/)

`sudo apt-get install mysql-server`
This was a bit of a problem on ubuntu 16.04
what solved it in the end was #16 answer on this [site](https://ubuntuforums.org/showthread.php?t=1763604&page=2)

## [Nginx](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-16-04)

We use nginx on the production and testing server as a reverse proxy, and as a termination point for HTTPS/TLS.

This is set up following these guides:

- [lets encrypt](https://www.digitalocean.com/community/tutorials/how-to-set-up-let-s-encrypt-with-nginx-server-blocks-on-ubuntu-16-04)
- [reverse proxy](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04#set-up-nginx-as-a-reverse-proxy-server)

To manage nginx use the following command
`sudo service nginx (start|stop|restart)`

### Debug/development tools

For debugging, install the following developer tools, google chrome extensions:

- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
- [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en)

## Switching between production and local

Any teams you have previously saved (for instance your real production team), is saved in local storage.
Local storage in electron is saved in a folder, specific to your operating system.
In macOS this folder is `~/Library/Application\ Support/FortDox/Local\ Storage`.
Make a backup of the contents, and you are good to go with local development.

# Branches

Development is done on the master branch. When a new release is to be deployed, merge master into the release branch.
**NEVER COMMIT ANYTHING ON THE RELEASE BRANCH, ONLY ON MASTER**

# Getting started

## First time configuration

Both the client and server needs configuration files to function correctly.

### Client

Copy the template from `fortdox/app/src/config/config-template.json` to `fortdox/app/src/config/config.json` and fill in necessary values.

This is a dummy version of the config file:

```
{
  "name": "FortDox",
  "productName": "FortDox",
  "server": "{some-domain-or-ip}",
  "logo": "/resources/logo.png",
  "applicationPath": "/Applications/FortDox.app",
  "codeSplitter": "@@",
  "clientVersion": "{a version number}",
  "autoUpdates": true,
  "permissions": {
    "1": "ADMIN",
    "2": "DELETE DOCUMENT",
    "4": "REMOVE USER",
    "8": "INVITE USER"
  }
}
```

### Server

Copy the template from `fortdox/server/server_modules/config-template.json` to `fortdox/server/server_modules/config.json` and fill in necessary values.

This is a dummy version of the config file:

```
{
  "name": "FortDox",
  "server": "{some-domain-or-ip}",
  "cors":"http://localhost:5000",
  "uploadPath":"/tmp/",
  "sqlConfig": {
    "username": "{you username}",
    "password": "{your password}",
    "database": "fortdox",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "logging": false,
    "operatorsAliases": false
  },
  "mailer": {
    "host": "{mail server}",
    "secure": true,
    "port": 465,
    "auth": {
      "user": "{your username}",
      "pass": "{your password}"
    }
  },
  "clientVersion": "{a version number}",
  "release":{
    "filename":"test.zip",
    "url":"/update/release",
    "name": "FortDox",
    "notes": "The all new summer update of FortDox's is finally here!"
  }
}
```

## Install app and server dependencies from npm.

Install the Node dependencies for client in `fortdox/app`

> npm install

Install the Node dependencies for server in `fortdox/server`

> npm install

## Server

Run the server in `fortdox/server`

> npm run dev

or in production:

> npm start

### ElasticSearch

_NOTE_: before running ElasticSearch, you need to install the ingest-attachment plugin

> bin/elasticsearch-plugin install ingest-attachment

Run ElasticSearch

> bin/elasticsearch

### MySQL Database

Run mySQL terminal client

> mysql -u root -p

Create the `fortdox` database in mysql.

> CREATE DATABASE fortdox

Run database migrations in `fortdox/server`, after installing [sequelize cli](https://github.com/sequelize/cli).

> sequelize db:migrate

## Client

Run the application in `fortdox/app`

> npm run dev

This is using [foreman](https://github.com/strongloop/node-foreman) to mange the react process, the electron process and the sass compiler process.
This is manged in the `Procfile`

# Developers

## Configuration

Set the development configuration file for client. `fortdox/app/src/config/config-template.json` to `fortdox/app/src/config/config-dev.json` and fill in necessary values.

This is a dummy version of the config file:

```
{
  "name": "FortDox",
  "productName": "FortDox",
  "server": {any server or test server},
  "logo": "/resources/logo.png",
  "applicationPath": "/Applications/FortDox.app",
  "codeSplitter": "@@",
  "clientVersion": "{a version number}",
  "autoUpdates": true,
  "permissions": {
    "1": "ADMIN",
    "2": "DELETE DOCUMENT",
    "4": "REMOVE USER",
    "8": "INVITE USER"
  }
}
```

## Tests

### Unit tests

Unit testing is handel using [jest](https://jestjs.io/).

Create a test file that has `test.js` file ending. Add a test.
Simply run `npm test` to let jest do its magic.

### Integration testing

To test complex flow like register, invite, new device, etc, we use the following system:  
All integration tests should be placed under the folder `tests/integraiton_test` and have a the file ending `it.js` to not interfere with jest.

To add a new test, the best way is to use one of the existing ones as your template.
The main idea is to have an exported function named `run` that contain summary of test result and one async function named `test`
that contain all the testing logic

When you are done, it should be added to `testrunner.it.js`, in the appropriate order you wish to run the tests.  
For example, the registration tests has to be run at least once before the other tests to generate the needed credentials.

The following flags can be used on the testrunner script:

- --register: Run dev_cleanup.it.js and start the testing flow from registration.
- --clean: Run dev_cleanup.it.js them exit

The testrunner can be run via `npm run integrationtest [-- [--register,--clean]]`.

## Migrations of changelog to version system

In earlier versions of FortDox there was a changelog system, this has now been replace with versions of documents.
A migration script is available to use when this update is to be used on a production system.
Please note that the migration script does only work on FortDox systems with one organization.
To use the script execute the following:

> node prepVersions.js

Pro tip: have your organization index number ready.

## Attachments and how the server handles them

In previous versions of FortDox all attachments where simply sent as base64 encoded strings and stored in elasticsearch.
This had its shortcomings and now we send files as multi part http request instead and by the magic of [multer](https://github.com/expressjs/multer) we stream them down to files on the file system. All uploaded files get a unique file name from multer and is placed in the folder assigned to the value `uploadPath` in `config.json`.
Metadata about the files is still stored in elasticsearch and instead of the actual file, we store the path to the file instead.

Probably, it already exists attachments conforming to the old way in elasticsearch. Thus, both the client and the server tries to handle this gracefully, but as consider this a warning that things might break. If that happens, the _solution_ is to reupload the files.

_Note:_ The filepath of the folder "uploads" should be an absolute path to the directory.

## Debugging client app

Debugging is done on the client through the Developer Tools (`cmd + alt + I` on Mac) in the Electron window. Simply insert a debugger statement `debugger;` to trigger the developer mode. React and Redux developer tools should be visible as tabs if they are correctly installed.

## Cleanup

On server in `fortdox/server`

> db:migrate:undo:all
> db:migrate

Remove indices from ElasticSearch

> curl -X DELETE 'http://localhost:9200/_all'

Clear local storage.

- Open DevTools in Electron (CMD+ALT+I or CTRL+ALT+I).
- Select the Application tab.
- Select Clear storage and at the bottom of the page, select 'Clear site data'.

Remove keys from keychain with name "FortDox"

### Cleanup script

There is a real _fulhack_ called `dev_cleanup.js` that can cleanup everything related to FortDox development.
**Please note**: This script comes without warranty and will break any production versions of fortdox running on your system.
**Warning**: It also removes local storage of the production version of FortDox. (See section _Switching between production and local_ for backup).

To run it:

> node dev_cleanup.it.js

It deletes everything!

## Backup on Mac

Locate the folder containing backup.sh and grant the file executable permissions

> chmod +x backup.sh

Navigate to the elasticsearch.yml file to set up path for the snapshot response

> /usr/local/etc/elasticsearch

Open with vim as sudo user (if elasticsearch was installed -g)

> vim elasticsearch.yml

In the section Labeled Paths, enter the desired location for the snapshot repository

> path.repo /var/elasticsearch_backup

Now all the "location" parameters in the backup.sh code will be relative the path you just entered.

Start a crontab that will run the backup script

> crontab -e

Insert the following line into the crontab

> 0 0 \* \* \* /path/to/server/backup.sh

Save and quit. The crontab will now run the backup code every night at 00:00.

## Backup on Ubuntu

NOTE: If on startup elasticsearch complains about not being able to allocate enough memory. Simply `sudo vim /etc/elasticsearch/jvm.options` and change:

> -Xms2g --> -Xms1g
> -Xmx2g --> -Xmx1g

Locate backup.sh and give it executable permissions `chmod +x backup.sh`.

Then give the user ownership over /etc/elasticsearch with `chown -R <user> /etc/elasticsearch`.

Now create the backup directory where you want it `sudo mkdir /var/elasticsearch_backup` and set priviliges for that folder `chmod 777 /var/elasticsearch_backup`.

Elasticsearch can now write to elasticsearch_backup. But the location needs to be specified in elasticsearch.yml.

Open elasticsearch with your favorite editor `vim /etc/elasticsearch/elasticsearch.yml`. And under Paths set the following:

> path.repo /var/elasticsearch_backup

Now set up the cronjob via the `crontab -e` command by entering the line below:

> 0 0 \* \* \* /absolute/path/to/backup.sh

Now restart Elasticsearch manually with the following commands:

Stop `sudo systemctl stop elasticsearch.service`

Start `sudo systemctl start elasticsearch.service`

Now the cronjob should create a folder labeled with the timestamp of the backup every night at 00:00.
Now it should work, if not Happy Googeling!

# Auto updates

In the file `howtobuild.md` it is described how to handle auto updates of the client.
There is also a helper script `build_app.sh` designed to sign and package a new build for release.
This .zip file can then easily be placed in the correct folder.

# Building installer

Install electron-builder via: `npm install electron-builder`,

Build for:

All platforms: `npm run all`

Mac: `npm run mac`

Linux: `npm run linux`

Windows: `npm run win` (or for 32-bit Windows, run `npm run win32`)

(Currently only works if you build on a Mac, for other platform support check out [this](https://github.com/electron-userland/electron-builder/wiki/Multi-Platform-Build))

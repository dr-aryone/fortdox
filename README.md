# FortDox

FortDox is a desktop application that safely stores a teams documents and shares a team's passwords safely within the team.

# Access Amazon server

navigate to `~/.ssh` and create a file `touch config`.

Copy paste the following into config:

> Host fortdox

        HostName 54.246.221.36
        Port 22
        User ubuntu
        IdentityFile ~/.ssh/private_keys/fortdox.pem (the private key that needs to be generated)

Generate said private key.

Then simply type `ssh fortdox` in the terminal.

Note: If private key is downloaded, dont forget to change permission using `chmod 400 /path/to/private_key`

# Installation

Clone the project

> git clone git@bitbucket.org:edgeguideab/fortdox.git

On production environmnet it can be useful to forward your own ssh agent to get access to bitbucket

## [Node.js](https://nodejs.org/)

Node version 8.11.3, follow instructions [here](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)

## [ElasticSearch](https://www.elastic.co/)

_Note:_ ElasticSearch requires Java version 8+, `sudo apt-get install default-jre`)

ElasticSearch version 6.3.0,
Installation Instructions [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/deb.html),
Installation path (on ubuntu at least): `/usr/share/elasticsearch/bin`
On production, use systemd or similar to manage elasticsearch as described [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/deb.html#deb-running-systemd)

_Note:_ If on startup Elasticsearch complains about not being able to allocate enough memory. Simply `sudo vim /etc/elasticsearch/jvm.options` and change:a

> -Xms1g --> -Xms512m  
> -Xmx1g --> -Xmx512m

- [Node.js](https://nodejs.org/)
- [ElasticSearch](https://www.elastic.co/)
- [MySQL](https://www.mysql.com/)

## [MySQL](https://www.mysql.com/)

`sudo apt-get install mysql-server`
This was a bit of a problem on ubuntu 16.04
what solved it in the end was #16 answer on this [site](https://ubuntuforums.org/showthread.php?t=1763604&page=2)

## Nginx

We use nginx on the productio and testing server as a reverse proxy, and as termination point for HTTPS/TLS.

This is set up following these guides:

- [lets encrypt]()
- [reverse proxy]()

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

## Install Node.js dependencies

Install the Node dependencies for client in `fortdox/app`

> npm install

Install the Node dependencies for server in `fortdox/server`

> npm install

# Getting started

## Set configuration files

Configuration files that are needed to run the application with the server.

### Client

Copy the template from `fortdox/app/config-template.json` to `fortdox/app/config.json` and fill in necessary values.

This is a dummy version of the config file:

```
{
  "name": "FortDox",
  "productName": "FortDox",
  "server": "http://localhost:8000",
  "logo": "/resources/logo.png"
}
```

### Server

Copy the template from `fortdox/server/server_modules/config-template.json` to `fortdox/server/server_modules/config.json` and fill in necessary values.

This is a dummy version of the config file:

```
{
  "name": "FortDox",
  "server": "http://localhost:8000",
  "mailer": {
    "host": "<ENTER MAIL HOST,e.g smtp.google.com>",
    "secure": true,
    "port": 465,
    "auth": {
      "user": "<ENTER EMAIL>",
      "pass": "<ENTER PASSWORD>"
    }
  },
  "sqlConfig": {
    "username": "<MySQL USERNAME",
    "password": "<MySQL PASSWORD",
    "database": "fortdox",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "logging": false
  }
}
```

## Server

Run the server in `fortdox/server`

> npm run dev

or in production:

> npm start

## ElasticSearch

_NOTE_: before running ElasticSearch, you need to install the ingest-attachment plugin

> bin/elasticsearch-plugin install ingest-attachment

Run ElasticSearch

> bin/elasticsearch

## MySQL Database

# Create the `fortdox` database in mysql. Run mySQL to enter the promt.

## Database

Run mySQL

> mysql -u root -p

Run database migrations in `fortdox/server`

> sequelize db:migrate

## Client

Run the application in `fortdox/app`

> npm run dev

This is using [foreman](https://github.com/strongloop/node-foreman) to mange the react process, the electron process and the sass compiler process.
This is manged in the `Procfile`

# Developers

## Tests

### Unit tests
Unit testing is handel using [jest](https://jestjs.io/).

Create a test file that has `test.js` file ending. Add a test.
Simply run `npm test` to let jest do its magic.

### Integration testing
To test complex flow like register,invite, new device, etc, we use the following system:  
All integration tests should be placed under the folder `tests/integraiton_test` and have a the file ending `it.js` to not interfere with jest.

To add a new test, the best way is to use one of the exisiting ones as your template.
The main idea is to have an exported function named `run` that contain summary of test result and one async function namend `test`
that contain all the testing logic


When you are done, it should be added to `testrunner.it.js`, in the appropirate order you wish to run the tests.  
For example, the registration tests has to be run at least once before the other tests to generat the needed credentials.

The following flags can be used on the testrunner script:  
* --register: Run dev_cleanup.it.js and start the testing flow from registraion.
* --clean: Run dev_cleanup.it.js them exit

The testrunner can be run via `npm run integrationtest [-- [--register,--clean]]`.


## Debugging client app

Debugging is done on the client through the Developer Tools (`cmd + alt + I` on Mac) in the Electron window. Simply insert a debugger statement `debugger;` to trigger the developer mode. React and Redux developer tools should be visible as tabs if they are correctly installed.

## Cleanup

On server in `fortdox/server`

> db:migrate:undo:all
> db:migrate

Remove indicies from ElasticSearch

> curl -X DELETE 'http://localhost:9200/_all'

Clear local storage.

- Open DevTools in Electron (CMD+ALT+I or CTRL+ALT+I).
- Select the Application tab.
- Select Clear storage and at the bottom of the page, select 'Clear site data'.

Remove keys from keychain with name "Fortdox"

## Backup on Mac

Locate the folder containing backup.sh and grant the file executable permissions

> chmod +x backup.sh

Navigate to the elasticsearch.yml file to set up path for the snapshot response

> /usr/local/etc/elasticsearch

Open with vim as sudo user (if elasticsearch was installed -g)

> vim elasticsearch.yml

In the section labled Paths, enter the desired location for the snapshot repository

> path.repo /var/elasticsearch_backup

Now all the "location" parameters in the backup.sh code will be relative the path you just entered.

Start a crontab that will run the backup script

> crontab -e

Insert the following line into the crontab

> 0 0 \* \* \* /path/to/server/backup.sh

Save and quit. The crontab will now run the backup code every night at 00:00.

## Backup on Ubuntu

NOTE: If on startup Elasticsearch complains about not being able to allocate enough memory. Simply `sudo vim /etc/elasticsearch/jvm.options` and change:

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

Now the cronjob should create a folder labled with the timestamp of the backup every night at 00:00.
Now it should work, if not Happy Googeling!

# Building installer

Install electron-builder via: `npm install electron-builder`,

Build for:

All platforms: `npm run all`

Mac: `npm run mac`

Linux: `npm run linux`

Windows: `npm run win`

(Currently only works if you build on a Mac, for other platform support chek out [this](https://github.com/electron-userland/electron-builder/wiki/Multi-Platform-Build))

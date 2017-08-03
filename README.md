# FortDox
FortDox is a desktop application that safely stores a teams documents and shares a team's passwords safely within the team.

# Access Amazon server
navigate to `~./ssh` and create a file `touch config`.

Copy paste the following into config:
  > Host fortdox
        HostName 54.246.221.36
        Port 22
        User ubuntu
        IdentityFile ~/.ssh/private_keys/fortdox.pem (the private key that needs to be generated)

Generate said private key.

Then simply type `ssh fortdox` in the terminal.
# Installation
Clone the project
> git clone git@bitbucket.org:edgeguideab/fortdoks.git

Install following tools (if they are not already installed):

* [Node.js](https://nodejs.org/)
* [ElasticSearch](https://www.elastic.co/)
* [MySQL](https://www.mysql.com/)

For debugging, install following developer tools:

* [Node Inspector](https://github.com/node-inspector/node-inspector)
* [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
* [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en)

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

# Build the Project into a Runnable Application
Build the application in `fortdoks/app`
> electron-packager . --overwrite --platform=darwin --arch=x64 --out=release-build;

# Developers
## Debugging
Debugging is done on the client through the Developer Tools (`cmd + alt + I` on Mac) in the Electron window. Simply insert a debugger statement `debugger;` to trigger the developer mode. React and Redux developer tools should be visible as tabs if they are correctly installed.

Debugging is done similar to the client side. Run the inspector instead of `npm start` in `fordoks/server`
>nodemon --inspect main.js

## Cleanup
On server in `fortdoks/server`
> db:migrate:undo:all
> db:mmigrate

Remove indicies from ElasticSearch
> curl -XGET 'http://localhost:9200/_cat/indices?v&pretty'

> curl -XDELETE 'http://localhost:9200/<index>

On client in `fortdoks/app`, remove `local_storage.json`, eg.
> rm local_storage.json

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
> 0 0 * * * /path/to/server/backup.sh

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
 > 0 0 * * * /absolute/path/to/backup.sh

Now restart Elasticsearch manually with the following commands:

  Stop `sudo systemctl stop elasticsearch.service`

  Start `sudo systemctl start elasticsearch.service`

Now the cronjob should create a folder labled with the timestamp of the backup every night at 00:00.
Now it should work, if not Happy Googeling!   

#Building installer

Install electron-builder via: `npm install electron-builder`,

Build for:

All platforms: `npm run all`

Mac: `npm run mac`

Linux: `npm run linux`

Windows: `npm run win`

(Currently only works if you build on a Mac, for other platform support chek out [this](https://github.com/electron-userland/electron-builder/wiki/Multi-Platform-Build))

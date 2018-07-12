/**
 * This script is useful when developing FortDox
 * It's main purpose is to clean up elasticsearch,MySQL and keychain to let a developer get a clean sheet. (all those organizations you know..)
 * Use at own risk.
 * author: David Skeppstedt
 */
const { spawn } = require('child_process');
const fs = require('fs-extra');

//First delete everything from elasticsearch
cleanES();
//Undo/Redo migrations for MySqsl
//This requires that the sequalize command line is globaly installed.
cleanMySQL()
  .then(() => {
    console.log('MySQL cleaned');
  })
  .catch(error => {
    console.error('Migrations failed', error);
  });

runCleankeychain();
removeLocalStorage()
  .then(() => {
    console.log('Localstorage cleaned');
  })
  .catch(error => {
    console.error('Local storage failed', error);
  });

//delete keychain passwords that has fortdox service related to it. Loop until exit code is 44 (i.e not 0)
//error 44: security: SecKeychainSearchCopyNext: The specified item could not be found in the keychain.
function runCleankeychain() {
  cleanKeychain()
    .then(code => {
      if (code === 0) {
        runCleankeychain();
      } else {
        console.log('Keychain cleaned');
      }
    })
    .catch(error => {
      console.error('Keychain could not be cleaned');
    });
}
async function cleanKeychain() {
  const security = spawn('security', [
    'delete-generic-password',
    '-s',
    'fortdox'
  ]);
  security.on('error', error => {
    throw error;
  });

  security.on('close', code => {
    return code;
  });
}

async function removeLocalStorage() {
  fs.remove(
    require('os').homedir() + '/Library/Application Support/FortDox',
    error => {
      if (error) throw error;
      return;
    }
  );
}

async function cleanES() {
  const esProcess = spawn('curl', [
    '-X',
    'DELETE',
    'http://localhost:9200/_all'
  ]);
  esProcess.on('error', error => {
    throw error;
  });
  esProcess.on('close', code => {
    if (code === 0) {
      console.log('Elasticsearch cleaned');
      return;
    } else {
      throw new Error('curl command did not exit with zero status code');
    }
  });
}

function cleanMySQL() {
  return undoMigration()
    .then(redoMigration)
    .catch(error => {
      console.error(error);
    });
}

function undoMigration() {
  return new Promise((resolve, reject) => {
    const undo = spawn('sequelize', ['db:migrate:undo:all']);
    undo.on('error', error => {
      throw error;
    });
    undo.on('close', code => {
      if (code === 0) {
        resolve('undo');
      } else {
        reject(
          new Error(
            'sequalize undo migration did not exit with zero status code'
          )
        );
      }
    });
  });
}

function redoMigration() {
  return new Promise((resolve, reject) => {
    const undo = spawn('sequelize', ['db:migrate']);
    undo.on('error', error => {
      console.error(error);
      throw error;
    });
    undo.on('close', code => {
      if (code === 0) {
        resolve('redo');
      } else {
        reject(
          new Error('sequalize migration did not exit with zero status code')
        );
      }
    });
  });
}

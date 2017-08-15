const fs = window.require('fs');
const uuid = require('uuid');
const path = window.require('path');
const MAX_NAME_COLLISSION_CHECKS = 100;

module.exports = {
  calculateName
};

function calculateName(folder, requestedName) {
  return new Promise(async (resolve, reject) => {
    let parsedName = path.parse(requestedName);
    let name = requestedName;
    let checks = 0;
    let foundName = false;

    while (!foundName && checks < MAX_NAME_COLLISSION_CHECKS) {
      let collission;
      try {
        collission = await checkForCollission(path.resolve(folder, name));
      } catch (error) {
        reject(error);
      }
      if (collission) {
        name = `${parsedName.name} (${checks + 1})${parsedName.ext}`;
        checks++;
      } else {
        foundName = true;
      }
    }

    if (!foundName) {
      name = `${parsedName.name}-${uuid()}${parsedName.ext}`;
    }
    resolve(name);
  });

  function checkForCollission(file) {
    return new Promise((resolve, reject) => {
      fs.stat(file, err => {
        if (err) {
          return err.code === 'ENOENT' ? resolve(false) : reject(err);
        }
        resolve(true);
      });
    });
  }
}

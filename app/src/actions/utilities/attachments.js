const fs = window.require('fs');
const uuid = require('uuid');
const path = window.require('path');
const MAX_NAME_COLLISION_CHECKS = 100;

export default {
  readSource,
  calculateName
};

export function readSource(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file.path, (error, data) => {
      if (error) {
        return reject(error);
      }
      resolve(data);
    });
  });
}

export function calculateName(folder, requestedName) {
  return new Promise(async (resolve, reject) => {
    let parsedName = path.parse(requestedName);
    let name = requestedName;
    let checks = 0;
    let foundName = false;

    while (!foundName && checks < MAX_NAME_COLLISION_CHECKS) {
      let collision;
      try {
        collision = await checkForCollision(path.resolve(folder, name));
      } catch (error) {
        reject(error);
      }
      if (collision) {
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

  function checkForCollision(file) {
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

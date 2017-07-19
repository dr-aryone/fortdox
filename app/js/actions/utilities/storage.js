const fs = window.require('fs');

const writeStorage = (username, privateKey, salt, organization, email) => {
  let storage;
  try {
    storage = JSON.parse(fs.readFileSync(window.__dirname + '/local_storage.json', 'utf-8'));
  } catch (error) {
    storage = {};
  }

  storage[email] = {
    [organization]: {
      username,
      privateKey,
      salt
    }
  };

  fs.writeFileSync(window.__dirname + '/local_storage.json', JSON.stringify(storage, null, 2));
};

const readStorage = () => {
  let storage;
  try {
    storage = JSON.parse(fs.readFileSync(window.__dirname + '/local_storage.json', 'utf-8'));
  } catch (error) {
    storage = {};
    fs.writeFileSync(window.__dirname + '/local_storage.json', JSON.stringify(storage, null, 2));
  }
  return storage;
};

module.exports = {writeStorage, readStorage};

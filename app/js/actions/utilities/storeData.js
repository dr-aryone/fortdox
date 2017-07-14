const fs = window.require('fs');

const storeData = (username, privateKey, salt, organization, email) => {
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

module.exports = storeData;

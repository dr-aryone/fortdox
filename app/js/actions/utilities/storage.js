const writeStorage = (privateKey, salt, organization, email) => {
  let storage;
  storage = window.localStorage.getItem('fortdox');
  if (!storage) {
    window.localStorage.setItem('fortdox', JSON.stringify({}));
    storage = window.localStorage.getItem('fortdox');
  }
  storage = JSON.parse(storage);
  storage[email] = {
    [organization]: {
      privateKey,
      salt
    }
  };
  window.localStorage.setItem('fortdox', JSON.stringify(storage));
};

const readStorage = () => {
  let storage;
  storage = window.localStorage.getItem('fortdox');
  if (!storage) {
    window.localStorage.setItem('fortdox', JSON.stringify({}));
    storage = window.localStorage.getItem('fortdox');
  }

  return JSON.parse(storage);
};

module.exports = {writeStorage, readStorage};

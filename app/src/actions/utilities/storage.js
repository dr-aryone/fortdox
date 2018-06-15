const { spawn } = window.require('child_process');
const keyChainPath = '/usr/bin/security';
// const config = require('../../../config.json');

const writeStorage = (salt, email, organization) => {
  let storage;
  storage = window.localStorage.getItem('fortdox');
  if (!storage) {
    window.localStorage.setItem('fortdox', JSON.stringify({}));
    storage = window.localStorage.getItem('fortdox');
  }
  storage = JSON.parse(storage);
  storage[email] = {
    [organization]: {
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

const addKey = (privateKey, email, organization) =>
  new Promise((resolve, reject) =>
    spawn(keyChainPath, [
      'add-generic-password',
      '-a',
      `${email}?${organization}`,
      '-s',
      'fortdox',
      '-w',
      privateKey
      //'-T',
      //config.applicationPath
    ])
      .on('close', code => (code === false ? resolve(code) : reject(code)))
      .on('error', reject)
  );

const readKey = (email, organization) =>
  new Promise((resolve, reject) => {
    const pwd = [];
    spawn(keyChainPath, [
      'find-generic-password',
      '-a',
      `${email}?${organization}`,
      '-s',
      'fortdox',
      '-g'
    ])
      .on('error', e => reject(e))
      .stderr.on('data', d => pwd.push(d))
      .on('close', code => {
        code === false ? resolve(pwd.toString()) : reject(code);
      });
  });

module.exports = { writeStorage, readStorage, addKey, readKey };

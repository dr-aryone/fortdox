const config = require('config.json');
const { spawn } = window.require('child_process');
const keyChainPath = '/usr/bin/security';

const writeDeviceIdToStorage = (deviceId, organization, email) => {
  let fortdoxInfo = readStorage();
  fortdoxInfo[email][organization].deviceId = deviceId;
  window.localStorage.setItem(config.name, JSON.stringify(fortdoxInfo));
};

const writeStorage = (salt, organization, email, deviceId) => {
  let fortdoxInfo = readStorage();
  fortdoxInfo[email] = {
    [organization]: {
      salt,
      deviceId
    }
  };
  window.localStorage.setItem(config.name, JSON.stringify(fortdoxInfo));
};
const readStorage = () => {
  let storage;
  storage = window.localStorage.getItem(config.name);
  if (!storage) {
    window.localStorage.setItem(config.name, JSON.stringify({}));
    storage = window.localStorage.getItem(config.name);
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
      `${config.name}`,
      '-w',
      privateKey
      //'-T',
      //config.applicationPath
    ])
      .on('close', code => {
        Number(code) === 0 ? resolve(code) : reject(code);
      })
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
      `${config.name}`,
      '-g'
    ])
      .on('error', e => reject(e))
      .stderr.on('data', d => pwd.push(d))
      .on('close', code => {
        Number(code) === 0 ? resolve(pwd.toString()) : reject(code);
      });
  });

const deleteKey = (email, organization) => {
  new Promise((resolve, reject) => {
    spawn(keyChainPath, [
      'delete-generic-password',
      '-a',
      `${email}?${organization}`,
      '-s',
      `${config.name}`
    ])
      .on('error', e => reject(e))
      .on('close', code => {
        Number(code) === 0 ? resolve() : reject(code);
      });
  });
};
module.exports = {
  writeStorage,
  writeDeviceIdToStorage,
  readStorage,
  addKey,
  readKey,
  deleteKey
};

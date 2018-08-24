const db = require('app/models');
const {
  decryptMasterPassword
} = require('app/encryption/keys/cryptMasterPassword');
const logger = require('app/logger');

const getUser = email => {
  return new Promise(async (resolve, reject) => {
    let user;
    try {
      user = await db.User.findOne({
        where: {
          email
        },
        include: [db.Organization]
      });
      if (!user) return reject(404);
      return resolve(user);
    } catch (error) {
      console.error(error);
      return reject(500);
    }
  });
};

const createUser = ({ email, password, organizationId, uuid }) => {
  return new Promise(async (resolve, reject) => {
    let user;
    try {
      user = await db.User.findOne({
        where: {
          email
        },
        include: [db.Organization]
      });
    } catch (error) {
      console.error(error);
      return reject(500);
    }
    if (user) {
      return reject(409);
    }
    try {
      const newUser = await db.User.create({
        email: email,
        password: password,
        organizationId: organizationId,
        uuid: uuid
      });
      return resolve(newUser);
    } catch (error) {
      console.error(error);
      return reject(401);
    }
  });
};

const verifyUser = (email, privateKey, deviceId) => {
  return new Promise(async (resolve, reject) => {
    let encryptedMasterPassword;
    let user;
    try {
      user = await db.User.findOne({ where: { email: email } });
      if (!user) {
        return reject(404);
      }
    } catch (error) {
      console.error(error);
      return reject(500);
    }

    let userDevice = await db.Devices.findOne({
      where: {
        userid: user.id,
        deviceId: deviceId
      }
    });
    encryptedMasterPassword = userDevice.password;

    let result = decryptMasterPassword(privateKey, encryptedMasterPassword);

    try {
      await user.updateAttributes({ uuid: null, activated: true });
    } catch (error) {
      console.error(error);
      return reject(500);
    }
    return resolve(result);
  });
};

const verifyNewUser = (deviceId, deviceName, uuid, privateKey) => {
  return new Promise(async (resolve, reject) => {
    let encryptedMasterPassword;
    let user;
    try {
      user = await db.User.findOne({
        where: {
          uuid
        },
        include: [db.Organization]
      });
      if (!user) {
        return reject(404);
      }

      const device = await db.Devices.findOne({
        where: {
          userid: user.id,
          deviceId: deviceId
        }
      });

      if (!device) {
        return reject(404);
      }

      encryptedMasterPassword = device.password;
    } catch (error) {
      console.error(error);
      return reject(500);
    }
    decryptMasterPassword(privateKey, encryptedMasterPassword);
    try {
      await user.updateAttributes({
        uuid: null,
        activated: true
      });

      await db.Devices.update(
        {
          activated: true,
          deviceName: deviceName
        },
        { where: { deviceId: deviceId } }
      );
    } catch (error) {
      console.error(error);
      return reject(500);
    }
    return resolve({
      email: user.email,
      organization: user.Organization.name
    });
  });
};

const setOrganizationId = ({ email, organizationId }) => {
  return new Promise(async (resolve, reject) => {
    let user;
    try {
      user = await db.User.findOne({
        where: {
          email: email
        }
      });
      if (!user) {
        return reject(404);
      }
      await user.updateAttributes({
        organizationId: organizationId
      });
      return resolve();
    } catch (error) {
      console.error(error);
      return reject(500);
    }
  });
};

const getOrganizationName = email => {
  return new Promise(async (resolve, reject) => {
    let user;
    try {
      user = await getUser(email);
    } catch (error) {
      console.error(error);
      reject(500);
    }
    return resolve(user.Organization.name);
  });
};

const verifyUUID = async uuid => {
  let result;
  let user;
  try {
    user = await db.User.findOne({
      where: { uuid }
    });
    if (!user) {
      throw 404;
    }
    result = {
      email: user.email,
      organizationId: user.organizationId,
      id: user.id
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
  return result;
};

module.exports = {
  createUser,
  setOrganizationId,
  verifyUser,
  verifyNewUser,
  getUser,
  getOrganizationName,
  verifyUUID
};

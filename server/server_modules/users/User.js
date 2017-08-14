const db = require('app/models');
const {decryptMasterPassword} = require('app/encryption/keys/cryptMasterPassword');

const getUser = email => {
  return new Promise(async (resolve, reject) => {
    let user;
    try {
      user = await db.User.findOne({
        where: {
          email: email
        },
        include: [db.Organization]
      });
      return resolve(user);
    } catch (error) {
      console.error(error);
      return reject(500);
    }
  });
};


const createUser = ({email, password, organizationId, uuid}) => {
  return new Promise(async(resolve, reject) => {
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
      await db.User.create({
        email: email,
        password: password,
        organizationId: organizationId,
        uuid: uuid
      });
      return resolve(201);
    } catch (error) {
      console.error(error);
      return reject(401);
    }
  });
};

const verifyUser = (email, privateKey) => {
  return new Promise(async (resolve, reject) => {
    let encryptedMasterPassword;
    let user;
    try {
      user = await db.User.findOne({where: {email: email}});
      if (!user) {
        return reject(404);
      }
      encryptedMasterPassword = user.password;
    } catch (error) {
      console.error(error);
      return reject(500);
    }
    let result = decryptMasterPassword(privateKey, encryptedMasterPassword);

    try {
      await user.updateAttributes({uuid: null});
    } catch (error) {
      console.error(error);
      return reject(500);
    }
    return resolve(result);

  });
};

const verifyNewUser = (uuid, privateKey) => {
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
      encryptedMasterPassword = user.password;
    } catch (error) {
      console.error(error);
      return reject(500);
    }
    decryptMasterPassword(privateKey, encryptedMasterPassword);
    try {
      await user.updateAttributes({
        uuid: null,

      });
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

const setOrganizationId = ({email, organizationId}) => {
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

const removeUser = (email, organizationId = null) => {
  return new Promise(async (resolve, reject) => {
    let user;
    try {
      user = await db.User.findOne({where: {
        email,
        organizationId
      }});
      if (!user) {
        return reject(404);
      }
    } catch (error) {
      console.error(error);
      return reject(500);
    }

    try {
      await user.destroy();
      return resolve(200);
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

const verifyUUID = uuid => {
  return new Promise(async (resolve, reject) => {
    let result;
    let user;
    try {
      user = await db.User.findOne({
        where: {uuid: uuid}
      });
      if (!user) {
        return reject(404);
      }
      result = {
        email: user.email,
        organizationId: user.organizationId
      };

    } catch (error) {
      console.error(error);
      return reject(500);
    }
    return resolve(result);

  });
};

module.exports = {
  createUser,
  setOrganizationId,
  verifyUser,
  verifyNewUser,
  getUser,
  removeUser,
  getOrganizationName,
  verifyUUID
};

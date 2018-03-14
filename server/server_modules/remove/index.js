const users = require('app/users');
const logger = require('app/logger');

module.exports = {
  removeUser
};

async function removeUser(req, res) {
  debugger;
  let email = req.params.email;
  let user;
  try {
    user = await users.getUser(email);
  } catch (error) {
    logger.log('error', `Could not find user ${email} @ /remove`);
    return res.status(error).send();
  }
  try {
    let isPendingUser = await users.TempKeys.exist(user.uuid);
    if (isPendingUser) await users.TempKeys.remove(user.uuid);
  } catch (error) {
    logger.log('error', `Could not remove pending ${email} @/remove`);
    return res.status(error).send();
  }
}

/*
async function request(req, res) {
  let privateKey = req.session.privateKey;
  let email = req.body.email;
  let userToBeRemoved = req.body.removalEmail;
  let organizationId = req.session.organizationId;
  let sender;
  try {
    sender = await users.getUser(email);
  } catch (error) {
    logger.log('error', `Could not find user ${email} @/remove`);
    return res.status(404).send();
  }
  try {
    await decryptMasterPassword(privateKey, sender.password);
    logger.log('info', `User ${email} authenticated`);
  } catch (error) {
    logger.log('error', `${email} could not authenticate properly @/remove`);
  }
  try {
    await pending.requestRemoval(userToBeRemoved, organizationId);
    logger.log('info', `User ${email} wants to remove user ${userToBeRemoved}`);
    return res.send();
  } catch (error) {
    logger.log('error', `${userToBeRemoved} cannot be in organization ${organizationId}`);
    return res.status(500).send();
  }

}
*/

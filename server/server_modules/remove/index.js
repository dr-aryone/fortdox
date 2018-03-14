const users = require('app/users');
const logger = require('app/logger');

module.exports = {
  removeUser
};

async function removeUser(req, res) {
  let email = req.params.email;
  let user;
  try {
    user = await users.getUser(email);
  } catch (error) {
    logger.log('error', `Could not find user ${email} @/removeUser`);
    return res.status(error).send();
  }

  try {
    let isPendingUser = await users.TempKeys.exist(user.uuid);
    if (isPendingUser) await users.TempKeys.remove(user.uuid);
  } catch (error) {
    logger.log('error', `Could not remove pending ${email} @/removeUser`);
    return res.status(error).send();
  }

  try {
    user.destroy();
    return res.send();
  } catch (error) {
    logger.log('error', `Could not delete ${email} from users @/removeUser`);
  }
}

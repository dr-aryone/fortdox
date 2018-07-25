const users = require('app/users');
const logger = require('app/logger');

module.exports = {
  removeUser
};

async function removeUser(req, res) {
  let email = req.params.email;
  let user;
  logger.info('/users/email DELETE', 'Try to delete user with email', email);
  try {
    user = await users.getUser(email);
  } catch (error) {
    logger.error('/users/email DELETE', `Could not find user ${email}`, error);
    return res.status(error).send();
  }

  try {
    let isPendingUser = await users.TempKeys.exist(user.uuid);
    if (isPendingUser) await users.TempKeys.remove(user.uuid);
  } catch (error) {
    logger.error(
      '/users/email/delete',
      `Could not remove pending ${email} @/removeUser`,
      error
    );
    return res.status(error).send();
  }

  try {
    user.destroy();
    logger.info('/users/email DELETE', 'User', email, 'deleted');
    return res.send();
  } catch (error) {
    logger.error(
      '/users/email DELETE',
      `Could not delete ${email} from users`,
      error
    );
  }
}

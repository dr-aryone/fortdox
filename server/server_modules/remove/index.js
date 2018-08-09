const db = require('app/models');
const logger = require('app/logger');
const users = require('app/users');

module.exports = {
  removeUser
};

async function removeUser(req, res) {
  let email = req.params.email;
  const organizationId = req.session.organizationId;
  let user;
  logger.info('/users/email DELETE', 'Try to delete user with email', email);
  try {
    const orgJoinUser = await db.Organization.findOne({
      where: { id: organizationId },
      include: [
        {
          model: db.User,
          as: 'users',
          where: { email: email }
        }
      ]
    });

    if (!orgJoinUser || !orgJoinUser.users || !orgJoinUser.users[0]) {
      throw new Error('No user, no Orgnazioatn');
    }

    user = orgJoinUser.users[0];
    if (orgJoinUser.owner === user.id) {
      logger.warn(
        '/users/email DELETE',
        `${req.session.email} tried to delete owner of organziation!`
      );
      return res.status(403).send();
    }
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

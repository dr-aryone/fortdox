const logger = require('app/logger');
const permissions = require('app/permissions');
const db = require('app/models');

async function deleteAdmin(req, res) {
  try {
    const userEmail = req.session.email;
    const orgJoinUser = await db.Organization.findOne({
      include: [
        {
          model: db.User,
          as: 'users',
          where: { email: userEmail }
        }
      ]
    });

    if (
      !orgJoinUser ||
      !orgJoinUser.users[0] ||
      orgJoinUser.owner != orgJoinUser.users[0].id
    ) {
      logger.warn(
        '/permission/admin DELETE',
        `${req.session.email} is not the owner of this organization`
      );
      return res.status(403).send();
    }

    const adminEmailToRemove = req.params.email;

    if (adminEmailToRemove === req.session.email) {
      logger.error(
        '/permission/admin delete',
        `${req.session.email} tried to delete it self as admin`
      );
      return res.status(400).send();
    }

    await db.User.update(
      { permission: permissions.BASE },
      { where: { email: adminEmailToRemove } }
    );

    return res.status(200).send();
  } catch (error) {
    logger.error(
      '/permissions/admin DELETE',
      'Could not query database for permission and owner information',
      error
    );
    return res.status(500).send();
  }
}

module.exports = deleteAdmin;

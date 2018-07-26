const db = require('app/models');
const logger = require('winston');

module.exports = {
  listOrganizationMembers
};

async function listOrganizationMembers(req, res) {
  const organizationId = req.session.organizationId;
  logger.info('/users', 'Listing members of organization', organizationId);
  let organization, tempKeys;
  try {
    [organization, tempKeys] = await Promise.all([
      db.Organization.findOne({
        where: {
          id: organizationId
        },
        include: [
          {
            model: db.User,
            as: 'users',
            attributes: ['email', 'uuid']
          }
        ]
      }),
      db.TempKeys.findAll({
        attributes: ['uuid']
      })
    ]);
  } catch (error) {
    logger.error('/users', error);
    res.status(500).send();
    return;
  }
  if (!organization) {
    logger.warn('/users', 'Could not find organization', organizationId);
    res.status(404).send('noSuchOrganization');
    return;
  }
  tempKeys = tempKeys || [];
  res.send(
    organization.users.map(user => {
      const pending = tempKeys.find(k => k.uuid === user.uuid);
      return {
        email: user.email,
        pending: !!pending //This is not a typo, it is a type conversion
      };
    })
  );
}

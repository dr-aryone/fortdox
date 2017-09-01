const db = require('app/models');
const logger = require('winston');

module.exports = {
  listOrganizationMembers
};

async function listOrganizationMembers(req, res) {
  const organizationId = req.session.organizationId;
  let organization;
  try {
    organization = await db.Organization.findOne({
      where: {
        id: organizationId
      },
      include: [{
        model: db.User,
        as: 'users',
        attributes: ['email']
      }]
    });
  } catch (error) {
    logger.error(error);
    res.status(500).send();
    return;
  }
  if (!organization) {
    res.status(404).send('noSuchOrganization');
    return;
  }
  res.send(organization.users.map(user => user.email));
}

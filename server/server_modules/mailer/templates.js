const config = require('../config.json');

const firstTimeRegistration = ({ to, organization, uuid }) => ({
  to,
  subject: `${config.name} registration for ${organization}`,
  from: config.mailer.auth.user,
  content: `<p><a href="${config.server}/activation-redirect?code=${uuid}">${
    config.server
  }/activation-redirect?code=${uuid} </a>`,
  html: `<p><a href="${config.server}/activation-redirect?code=${uuid}">${
    config.server
  }/activation-redirect?code=${uuid} </a>`
});

const newUserRegistration = ({
  to,
  organization,
  uuid,
  from,
  tempPassword
}) => ({
  to,
  subject: `${from} has invited you to join team ${organization} in ${
    config.name
  }`,
  from: config.mailer.auth.user,
  content: `<p><a href="${
    config.server
  }/invite-redirect?code=${uuid}&pass=${encodeURIComponent(tempPassword)}"> ${
    config.server
  }/invite-redirect?code=${uuid}&pass=${encodeURIComponent(tempPassword)} </a>`,
  html: `<p><a href="${
    config.server
  }/invite-redirect?code=${uuid}&pass=${encodeURIComponent(tempPassword)}"> ${
    config.server
  }/invite-redirect?code=${uuid}&pass=${encodeURIComponent(tempPassword)} </a>`
});

module.exports = {
  firstTimeRegistration,
  newUserRegistration
};

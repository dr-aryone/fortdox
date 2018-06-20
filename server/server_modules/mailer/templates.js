const config = require('../config.json');

const firstTimeRegistration = ({ to, organization, uuid }) => ({
  to,
  subject: `${config.name} registration for ${organization}`,
  from: config.mailer.auth.user,
  content: `<p><a href="${config.server}/activation-redirect?code=${uuid}">${
    config.server
  }/activation-redirect?code=${uuid} </a><p>Activation code:</p><p>${uuid}</p>`,
  html: `<p><a href="${config.server}/activation-redirect?code=${uuid}">${
    config.server
  }/activation-redirect?code=${uuid} </a><p>Activation code:</p><p>${uuid}</p>`
});

const newDeviceRegistration = ({ to, uuid, tempPassword }) => ({
  to,
  subject: 'Fortdox new device',
  from: 'Frtdox',
  content: `
  <p>Invitation code:</p>
  <p>${uuid}</p>
  <p>Temporary password:</p>
  <p>${encodeURIComponent(tempPassword)}</p>`,
  html: `
  <p>Invitation code:</p>
  <p>${uuid}</p>
  <p>Temporary password:</p>
  <p>${encodeURIComponent(tempPassword)}</p>`
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
  }/invite-redirect?code=${uuid}&pass=${encodeURIComponent(tempPassword)} </a>
  <p>Invitation code:</p>
  <p>${uuid}</p>
  <p>Temporary password:</p>
  <p>${encodeURIComponent(tempPassword)}</p>`,
  html: `<p><a href="${
    config.server
  }/invite-redirect?code=${uuid}&pass=${encodeURIComponent(tempPassword)}"> ${
    config.server
  }/invite-redirect?code=${uuid}&pass=${encodeURIComponent(tempPassword)} </a>
  <p>Invitation code:</p>
  <p>${uuid}</p>
  <p>Temporary password:</p>
  <p>${encodeURIComponent(tempPassword)}</p>`
});

module.exports = {
  firstTimeRegistration,
  newUserRegistration,
  newDeviceRegistration
};

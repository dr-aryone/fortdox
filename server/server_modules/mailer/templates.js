

const firstTimeRegistration = ({to, organization, uuid}) => ({
  to,
  subject: `Fort Dox registration for ${organization}`,
  content: `<p><a href="http://localhost:8000/activation-redirect?code=${uuid}"> http://localhost:8000/activation-redirect?code=${uuid} </a>`,
  html: `<p><a href="http://localhost:8000/activation-redirect?code=${uuid}"> http://localhost:8000/activation-redirect?code=${uuid} </a>`
});

const newUserRegistration = ({to, organization, uuid, from, tempPassword}) => ({
  to,
  subject: `${from} has invited you to join team ${organization} in Fort Dox`,
  content: `<p><a href="http://localhost:8000/invite-redirect?code=${uuid}&pass=${tempPassword}"> http://localhost:8000/invite-redirect?code=${uuid}&pass=${tempPassword} </a>`,
  html: `<p><a href="http://localhost:8000/invite-redirect?code=${uuid}&pass=${tempPassword}"> http://localhost:8000/invite-redirect?code=${uuid}&pass=${tempPassword} </a>`,
});

module.exports = {
  firstTimeRegistration,
  newUserRegistration
};

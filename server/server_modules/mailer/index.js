'use strict';

const nodemailer = require('nodemailer');
const {firstTimeRegistration} = require('./templates.js');
const {newUserRegistration} = require('./templates.js');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'edgeguidetester@gmail.com',
    pass: 'edgegu1de'
  }
});

module.exports = {
  send
};

function send(mailOptions) {
  return new Promise((resolve, reject) => {

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return reject(error);
      }
      resolve('Message %s sent: %s', info.messageId, info.response);
    });
  });
}

module.exports = {
  send,
  newUserRegistration,
  firstTimeRegistration
};

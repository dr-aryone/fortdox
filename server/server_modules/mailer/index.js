'use strict';
const config = require('../config.json');
const nodemailer = require('nodemailer');
const {firstTimeRegistration} = require('./templates.js');
const {newUserRegistration} = require('./templates.js');

let transporter = nodemailer.createTransport(config.mailer);

transporter.verify(function(error) {
  if (error) {
    console.log(error);
  } else {
    console.log('Mailer is ready');
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

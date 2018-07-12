'use strict';
const config = require('../config.json');
const nodemailer = require('nodemailer');
const {
  firstTimeRegistration,
  newDeviceRegistration,
  newUserRegistration
} = require('./templates.js');

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
  if (mailOptions.to.includes('example.org')) {
    return Promise.resolve('Faked message');
  }

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
  newDeviceRegistration,
  firstTimeRegistration
};

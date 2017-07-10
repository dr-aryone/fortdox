'use strict';

const nodemailer = require('nodemailer');

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

function send({to, subject, content} = {}) {
  return new Promise((resolve, reject) => {
    let mailOptions = {
      to,
      subject,
      text: content,
      html: content
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return reject(error);
      }
      resolve('Message %s sent: %s', info.messageId, info.response);
    });
  });
}

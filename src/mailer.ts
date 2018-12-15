import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

console.log("hello world")

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || '',
  port: parseInt(process.env.MAIL_PORT) || 587,
  auth: {
      user: process.env.MAIL_USER || '',
      pass: process.env.MAIL_PW || '',
  },
});

let message = {
  from: 'Sender Name <sender@example.com>',
  to: 'Recipient <recipient@example.com>',
  subject: 'Nodemailer is unicode friendly ✔',
  text: 'NEIL!',
  html: '<p><b>NEIL</b> to myself!</p>'
};

transporter.sendMail(message, (err, info) => {
    if (err) {
        console.log('Error occurred. ' + err.message);
      return process.exit(1);
    }

    console.log('Message sent: %s', info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
});
// });

const test = {

}

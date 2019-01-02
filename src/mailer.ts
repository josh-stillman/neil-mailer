import nodemailer from 'nodemailer';
import mailgunTransport from 'nodemailer-mailgun-transport'
import dotenv from 'dotenv';
dotenv.config();

// const transporter = nodemailer.createTransport({
//   host: process.env.MAIL_HOST || '',
//   port: parseInt(process.env.MAIL_PORT, 10) || 587,
//   auth: {
//     user: process.env.MAIL_USER || '',
//       pass: process.env.MAIL_PW || '',
//   },
// });

// Configure transport options
const mailgunOptions = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_URL,
  }
}

const xport = mailgunTransport(mailgunOptions);
const mailgun = nodemailer.createTransport(xport);


// const gmail = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//            user: process.env.GMAIL_USER,
//            pass: process.env.GMAIL_PW,
//        },
// });


const message = {
  from: 'neil@electricneil.com',
  to: 'joshstillman@gmail.com',
  subject: 'mailgun test msg✔',
  text: 'NEIL!',
  html: '<p><b>NEIL</b> to myself!</p>'
};

mailgun.sendMail(message, (err: any, info: any) => {
    if (err) {
      console.log('Error occurred. ' + err.message);
      return process.exit(1);
    }
    console.log("err, info", err, info)
    console.log('Message sent: %s', info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
});




// transporter.sendMail(message, (err, info) => {
//     if (err) {
//         console.log('Error occurred. ' + err.message);
//       return process.exit(1);
//     }

//     console.log('Message sent: %s', info.messageId);
//     // Preview only available when sending through an Ethereal account
//     console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
// });
// gmail.sendMail(message, (err, info) => {
//     if (err) {
//         console.log('Error occurred. ' + err.message);
//       return process.exit(1);
//     }

//     console.log('Message sent: %s', info.messageId);
//     // Preview only available when sending through an Ethereal account
//     console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
// });


// });

import nodemailer from 'nodemailer';
import mailgunTransport from 'nodemailer-mailgun-transport'
import dotenv from 'dotenv';
dotenv.config();

import { NeilDB } from './db';

// const transporter = nodemailer.createTransport({
//   host: process.env.MAIL_HOST || '',
//   port: parseInt(process.env.MAIL_PORT, 10) || 587,
//   auth: {
//     user: process.env.MAIL_USER || '',
//       pass: process.env.MAIL_PW || '',
//   },
// });

const mailgunOptions = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_URL,
  },
};

const xport = mailgunTransport(mailgunOptions);
const mailgun = nodemailer.createTransport(xport);

const sendMail = async () => {
  const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017';

  const ndb = new NeilDB(mongoUrl);
  await ndb.connect();

  const col = await ndb.getCollection('subscribers')

  await col.insertOne({ email: 'test1', createdAt: new Date(), confirmed: false})

  const users = await col.find({});

  await users.forEach((user: any) => {
    const message = {
      from: 'neil@electricneil.com',
      to: user.email,
      subject: 'mailgun test msg✔',
      text: 'NEIL!',
      html: `<p>hello ${user.email}, your mongo id is ${user._id}</p>`
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
  });

  await ndb.disconnect();
}

sendMail();



// const gmail = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//            user: process.env.GMAIL_USER,
//            pass: process.env.GMAIL_PW,
//        },
// });

// const message = {
//   from: 'neil@electricneil.com',
//   to: 'joshstillman@gmail.com',
//   subject: 'mailgun test msg✔',
//   text: 'NEIL!',
//   html: '<p><b>NEIL</b> to myself!</p>'
// };

// mailgun.sendMail(message, (err: any, info: any) => {
//     if (err) {
//       console.log('Error occurred. ' + err.message);
//       return process.exit(1);
//     }
//     console.log("err, info", err, info)
//     console.log('Message sent: %s', info.messageId);
//     // Preview only available when sending through an Ethereal account
//     console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
// });




// // transporter.sendMail(message, (err, info) => {
// //     if (err) {
// //         console.log('Error occurred. ' + err.message);
// //       return process.exit(1);
// //     }

// //     console.log('Message sent: %s', info.messageId);
// //     // Preview only available when sending through an Ethereal account
// //     console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
// // });
// // gmail.sendMail(message, (err, info) => {
//     if (err) {
//         console.log('Error occurred. ' + err.message);
//       return process.exit(1);
//     }

//     console.log('Message sent: %s', info.messageId);
//     // Preview only available when sending through an Ethereal account
//     console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
// });


// });

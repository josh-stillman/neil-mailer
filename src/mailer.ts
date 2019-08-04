import nodemailer from 'nodemailer';
import mailgunTransport from 'nodemailer-mailgun-transport'
import Email from 'email-templates';
import dotenv from 'dotenv';
dotenv.config();

import { NeilDB } from './db';

const mailgunOptions = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_URL,
  },
};

const xport = mailgunTransport(mailgunOptions);
const mailgun = nodemailer.createTransport(xport);

const sendMail = async () => {
  const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/neil';

  const ndb = new NeilDB(mongoUrl);
  await ndb.connect();

  const col = await ndb.getCollection('subscribers')

  const users = await col.find({}).limit(1);

  await users.forEach(async (user: any) => {

    const email = new Email({
      message: {
        from: 'neil@electricneil.com',
      },
      transport: mailgun,
      views: {
        options: {
          extension: 'ejs'
        }
      }
    });

    await email.send({
      template: 'showReminder',
      message: {
        to: user.email,
      },
      locals: {
        name: 'Elon',
        unsubscribeLink: `https://www.electricneil.com/unsubscribe/${user._id}`,
      }
    })
    .then((res: any) => {
      console.log('res.originalMessage', res.originalMessage)
    })
    .catch(console.error);
  });

  await ndb.disconnect();
}

sendMail();

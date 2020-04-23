import nodemailer from 'nodemailer';
import mailgunTransport from 'nodemailer-mailgun-transport';
import Email from 'email-templates';
import dotenv from 'dotenv';
dotenv.config();

import { User, EmailDetails } from './types';
import { emailLocals } from './locals';
import { ObjectId } from 'bson';

const mailgunOptions = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_URL,
  },
};

const xport = mailgunTransport(mailgunOptions);
const mailgun = nodemailer.createTransport(xport);

const sendTestMail = async (emailDetails: EmailDetails) => {
  const users: User[] = [{
    _id: new ObjectId(),
    name: 'josh',
    email: 'joshstillman+neil-test@gmail.com',
    confirmed: true,
    createdAt: new Date().toISOString(),
  }];

  users.forEach(async (user: User ) => {
    if (!user.confirmed) {
      console.log('skipping; user not confirmed', user._id);
      return;
    }

    const email = new Email({
      message: {
        from: 'neil@electricneil.com'
      },
      transport: mailgun,
      send: true,
      juice: false,
      views: {
        options: {
          extension: 'ejs',
        },
      },
    });

    await email.send({
      template: 'showReminder',
      message: {
        to: user.email,
      },
      locals: {
        ...emailDetails,
        name: user.name,
        unsubscribeLink: `https://www.electricneil.com/?unsubscribe=${user._id}`,
      },
    })
    .then((res: any) => {
      console.log('res.originalMessage', res.originalMessage);
    })
    .catch(console.error);
  });

};

sendTestMail(emailLocals);

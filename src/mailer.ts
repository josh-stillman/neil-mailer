import nodemailer from 'nodemailer';
import mailgunTransport from 'nodemailer-mailgun-transport'
import Email from 'email-templates';
import dotenv from 'dotenv';
dotenv.config();

import { NeilDB } from './db';
import { User } from './types';

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

  await users.forEach(async (user: User ) => {
    if (!user.confirmed) {
      console.log("skpuser not confirmed", user._id)
      return;
    }

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
        subject: 'Electric Neil at the Bitter End this Saturday',
        imgLink: '/Users/joshstillman/Development/personal-projects/neil-mailer/emails/showReminder/neil-brew-show.png',
        header: 'The Return of the Neil!',
        body: `Greetings Neil Fans,\n\nFresh off our Rockaway Brewery warmup show, The Neil is back for its official return show this Saturday, August 10th, at 8pm at the historic Bitter End on Bleeker Street!\n\nMario's foot is all healed up, and the Neil is sounding bigger and badder than ever with the addition of the newest Neiler, Mike Bruno on guitar and vocals.\n\nWe'll be playing a bunch of new tunes, a few old favorites, and even some new originals.  Come on out and Neil-Out with us this Saturday evening. It'll be a Neiling good time.`,
        showTime: '8pm Sat. 8/10',
        calendarLink: 'https://calendar.google.com',
        venue: 'The Bitter End',
        mapLink: 'https://maps.google.com',
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

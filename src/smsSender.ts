import dotenv from 'dotenv';
dotenv.config();
const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
const service = client.notify.services(process.env.TWILIO_NOTIFY_SERVICE_SID);

import { NeilDB } from './db';
import { User } from './types';

// const body = 'This is the Electric Neil Hotline at 587-NEIL. Get ready to rock out with the boys tomorrow at 8pm at the Bitter End! 🤘 STOP to cancel.';
const body = '587-NEIL inviting you to jam w/ Electric Neil today at 9pm at the Way Station.🤘 (Psst.. call this number for a top-secret Neil message). STOP to cancel.';

const sendSms = async () => {

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/neil';

const ndb = new NeilDB(mongoUrl);
await ndb.connect();

const col = await ndb.getCollection('subscribers');

// For testing
const users = await col.find({ phoneNumber: /4252736456/ }).toArray();
// const users = await col.find({ phoneNumber: { '$exists' : true }}).toArray();

const phoneNumbers = users.map((user: User) => user.phoneNumber).filter((number: string) => number !== '');
console.log('phone numbers are', phoneNumbers);
const numbers = [...phoneNumbers];

console.log('phone numbers are', numbers);

const bindings = numbers.map(number => {
    return JSON.stringify({ binding_type: 'sms', address: number });
  });

await service.notifications
    .create({
          toBinding: bindings,
          body: body,
    })
    .then((notification: any) => {
          console.log(notification);
    })
    .catch((err: any) => {
          console.error('error is', err);
    });

process.exit(0);
  };

sendSms();


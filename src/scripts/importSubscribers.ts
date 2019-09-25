import papaparse from 'papaparse';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

import { NeilDB } from '../db';

const myFile = fs.createReadStream(process.argv[2]);

papaparse.parse(myFile, {
  header: true,
  skipEmptyLines: 'greedy',
  complete: (results: any) => {
    importSubscribers(results.data);
  }
});


const importSubscribers = async (rows: any) => {
  const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/neil';
  console.log("mongo url is", mongoUrl)
  // console.log("rows are,", rows)
  const ndb = new NeilDB(mongoUrl);
  await ndb.connect();

  const col = await ndb.getCollection('subscribers')

  const newSubscribers = rows.map((row: any) => ({email: row.email, name: row.name, ...row.phoneNumber ? {phoneNumber: row.phoneNumber} : {}, createdAt: new Date().toISOString(), confirmed: true}))
  console.log("newSubscribers are", newSubscribers)
  try {
  await col.insertMany(newSubscribers, { ordered: false })
  } catch (e) {
    console.log("e is", e)
  }
  await ndb.disconnect();
}

import { MongoClient, MongoClientOptions, DbCollectionOptions, ReadPreference, Db } from 'mongodb';

import dotenv from 'dotenv';
dotenv.config();

export class NeilDB {

  url: string;
  mongoClient?: MongoClient;
  db?: Db;

  constructor(url: string) {
      this.url = url;
  }

  async connect() {
      const options: MongoClientOptions = {
          ssl: true,
          socketTimeoutMS: 1000,
          useNewUrlParser: true,
      };

      return new Promise((resolve, reject) => {
          MongoClient.connect(this.url, options, (err, client) => {
              if (err) {
                  reject(err);
              } else {
                  this.mongoClient = client;
                  this.db = client.db();
                  resolve(this.db);
              }
          });
      });
  }

  async disconnect() {
      this.mongoClient!.close();
  }

  async getCollection(collectionName: string) {
    const options: DbCollectionOptions = {
        readPreference: ReadPreference.PRIMARY_PREFERRED,
    };

    return this.db!.collection(collectionName, options, () => {});
  }
}

// const db = new NeilDB(process.env.MongoURL);

// const main = async () => {
//   const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017';

//   const ndb = new NeilDB(mongoUrl);
//   await ndb.connect();

//   const col = await ndb.getCollection('subscribers')

//   await col.insertOne({ email: 'test1', createdAt: new Date(), confirmed: false})

//   const users = await col.find({});

//   await users.forEach((user: any) => {
//     console.log("user is", user);
//   });

//   await ndb.disconnect();
// }

// main().then();


// const test = async () => {
//   await.

// }
// db.connect().then((db) => {
//   db.getCollection('subscribers')
// })



// class NeilDB {







// }
// const options: MongoClientOptions = {
//   ssl: true,
//   socketTimeoutMS: 1000,
//   useNewUrlParser: true,
// };

// return new Promise((resolve, reject) => {
//   MongoClient.connect(this.url, options, (err, client) => {
//       if (err) {
//           reject(err);
//       } else {
//           this.mongoClient = client;
//           this.db = client.db();
//           resolve(this.db);
//       }
//   });
// });






// mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true});

// const SubscriberSchema = new mongoose.Schema({
//   email: String,
//   createdAt: Date,
//   confirmed: Boolean,
// });

// const Subscriber = mongoose.model('Subscriber', subscriberSchema);

// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   console.log('were connected!')

//   User.find(function (err, users) {
//     if (err) return console.error(err);
//     console.log("users is", users);
//   })

//   // const user2 = new User({ email: 'test', createdAt: new Date(), confirmed: false});
//   // user2.save().then((err) => console.log('user saved', user2, err));


// });

// // const user2 = new User({ email: 'test', createdAt: new Date(), confirmed: false});
// // user2.save().then((err) => console.log('user saved', user2, err));


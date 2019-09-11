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
          // TODO: reenable for deployment
        //   ssl: true,
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

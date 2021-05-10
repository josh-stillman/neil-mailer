import { NeilPost, executePost } from "./postRunner";
import { NeilDB } from "../db";

const consume = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/neil';

    const ndb = new NeilDB(mongoUrl);
    await ndb.connect();

    const col = await ndb.getCollection('posts');

    const posts = await col.find({ executeAt: { $lte: new Date() }}).toArray();

    if (!posts.length) {
      console.log('Nothing to post', new Date().toDateString());
    }

    for (const post of posts) {
      await executePost(post);
      await col.deleteOne({_id: post._id})
    }

    await ndb.disconnect();

    console.log('Posting complete', new Date().toDateString());
  } catch (e) {
    console.error('Error in post consumer', e)
  }
}

consume();

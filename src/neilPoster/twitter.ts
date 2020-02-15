import Twitter from 'twitter';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

import { NeilPost } from './postRunner';

const client = new Twitter({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token_key: process.env.access_token_key,
  access_token_secret: process.env.access_token_secret
});

export const sendTweet = async (neilPost: NeilPost) => {

  if (!neilPost.tempImageLocation) {
    console.error('no image provided')
  }

  var data = fs.readFileSync(neilPost.tempImageLocation);

  const mediaId = await client.post('media/upload', {media: data}).catch((err: any) => console.log(err));

  console.log(mediaId);
  if (!mediaId) {
    return;
  }

  var status = {
    status: neilPost.text,
    media_ids: mediaId.media_id_string
  }

  const result = await client.post('statuses/update', status).catch((err: any) => console.log(err));;

  console.log(result);
}


import Twitter from 'twitter';
import Path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const client = new Twitter({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token_key: process.env.access_token_key,
  access_token_secret: process.env.access_token_secret
});

const sendTweet = async () => {

  // Load your image
  const path = Path.resolve('mike-rockin-cropped-small.jpeg')
  var data = require('fs').readFileSync(path);

  // Make post request on media endpoint. Pass file data as media parameter
  const mediaId = await client.post('media/upload', {media: data}).catch((err: any) => console.log(err));

  console.log(mediaId);
  if (!mediaId) {
    return;
  }

  // Lets tweet it
  var status = {
    status: 'I am a tweet',
    media_ids: mediaId.media_id_string // Pass the media id string
  }

  const result = await client.post('statuses/update', status).catch((err: any) => console.log(err));;

  console.log(result);
}

sendTweet();


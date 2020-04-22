import fs from 'fs';
import request from 'request-promise';
import { ObjectId } from 'bson';
import dotenv from 'dotenv';
dotenv.config();

import { bitPost } from "./BITScript";
import { igPost } from "./IGScript";
import { sendTweet } from "./twitter";
import { addTextToImage } from './imageProcessor';

export interface NeilPost {
  _id?: ObjectId;
  createdAt: string;
  executeAt: string;
  imageName: string;
  tempImageLocation?: string;
  imageText?: string;
  text: string;
  calendarLink?: string;
  services: {
    ig?: boolean;
    bit?: boolean;
    fb?: boolean;
    tw?: boolean;
  }
}

export const executePost = async (neilPost: NeilPost) => {
  try {
    const { ig, bit, fb, tw } = neilPost.services;
    console.log('Neil post is', neilPost);

    if (!Object.values(neilPost.services).some((service: boolean) => service )) {
      console.error('No services selected for Post')
    }

    const tempImageLocation = await saveTempImage(neilPost.imageName);

    if (neilPost.imageText) {
      await addTextToImage(tempImageLocation, neilPost.imageText);
    }

    const finalPost: NeilPost = {
      ...neilPost,
      text: `${neilPost.text}${neilPost.calendarLink ? ` Add to Calendar: ${neilPost.calendarLink}` : ''}`,
      tempImageLocation
    }

    const promises = [
        ...tw ? [sendTweet(finalPost)] : [],
        ...ig ? [igPost(finalPost)] : [],
        ...bit ? [bitPost(finalPost)] : []
    ];

    await Promise.all(promises.map((p) => p.catch(e => console.log(e))));

    fs.unlinkSync(tempImageLocation)

    console.log('Successfully ran job')

  } catch (e) {
    console.error('Error in postRunner is', e);
  }
}

const saveTempImage = async (imageName: string): Promise<string> => {
  try {
    const fileData = await request({
      uri: getImageUrl(imageName),
      encoding: 'binary'
    });

    const tempImageLocation = getTempImageLocation(imageName)

    fs.writeFileSync(tempImageLocation, fileData, { encoding: 'binary' });

    return tempImageLocation;
  } catch (e) {
    console.log('error in save image is', e);
  }
}

const getImageUrl = (imageName: string) => `${process.env.IMAGE_URL}/${imageName}`;

const getTempImageLocation = (imageName: string) => `${process.env.TEMP_DIR || '.'}/${imageName}`;

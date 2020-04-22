import request from 'request-promise';
import dotenv from 'dotenv';
import { DateTime, Interval } from 'luxon';
import { NeilPost } from './postRunner'

dotenv.config();
// get array of photos from frontend.
//to make unique, mutate the Array, use new length

// could do array of texts.

// get number of posts

// week of - 4
// week before - 3
// week before - 2
// all weeks prior - 1

const setPosts = async () => {
  const json = await request({
    uri: `${process.env.IMAGE_URL}/images.json`,
    // encoding: 'binary'
    json: true,
  });
  const pics = json.pics;
  console.log(pics.length, pics);

  const random = Math.floor(Math.random() * pics.length);

  console.log('random', pics[random]);

  const show = DateTime.fromISO('2020-03-21');
  const today = DateTime.local();
  const i = Interval.fromDateTimes(today, show);

  console.log(i.length('weeks') );
  console.log(i.length('days') );


  // const days = show.diff(today, 'days').days;
  // const weeks = show.diff(today, 'weeks').weeks;
  // console.log(days, weeks);

  // console.log(getWeekPosts(show, 5));

  // get random pic
  let mutablePics: string[] = [...pics];

  const getRandomPic = (): string => {
    if (mutablePics.length < 1) {
      mutablePics = [...pics];
    }
    return mutablePics.splice(Math.floor(Math.random() * mutablePics.length), 1)[0]
  }

  // add in text to images? with Jimp?

  const dates = [...Array(Math.ceil(i.length('weeks')))]
    .map((a, i) => getWeekPosts(show.minus({weeks: i}), Math.max(5 - i, 1)))
    .reduce((acc: string[], el: string[]) => [...acc, ...el], [])

  const posts = dates.map((executeAt: string): NeilPost => ({
    executeAt,
    createdAt: new Date().toISOString(),
    imageName: getRandomPic(),
    text: 'hello world',
    services: {
      tw: true,
      ig: true,
    }

  }) )
  console.log(posts);

}

const getWeekPosts = (showWeekDay: DateTime, postsPerWeek: number = 1, ) => {
  const cadence: {[key: number]: number[]} = {
    5: [0,1,2,4,6],
    4: [0,2,4,6],
    3: [0,3,6],
    2: [0,6],
    1: [0],
  }

  return cadence[postsPerWeek].map((num: number) => (
    showWeekDay.minus({days: num}) > DateTime.local() ? showWeekDay.minus({days: num}).toISODate() : null
  )).filter((entry: string | null) => entry);
}

setPosts();

// shorten calendar link via api here?

// {
  // "createdAt" : ISODate("2020-02-15T22:08:11.182+0000"),
  // "executeAt" : ISODate("2020-02-15T22:07:11.182+0000"),
  // "imageName" : "20190810_14.jpg",
  // "imageText" : "Sat. 3/21 8:30pm @ The Delancey",
  // "text" : "Electric Neil returns, Sat. 3/21 8:30pm at the Delancey!",
  // "calendarLink" : "https://cutt.ly/neil",
  // "services" : {
  //     "ig" : false,
  //     "bit" : false,
  //     "fb" : false,
  //     "tw" : true
  // },
//   // "_id" : ObjectId("5e5155a0d504515378cce2c6")
// }


// TODO:
  // add image text functionality
  // set image text on post object
  // add that to the runner and test.



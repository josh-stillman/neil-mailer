import puppeteer from 'puppeteer'
import devices from 'puppeteer/DeviceDescriptors';
import dotenv from 'dotenv';
dotenv.config();

// const puppeteer = require('puppeteer')
// const devices = require('puppeteer/DeviceDescriptors')
const iPhonex = devices['iPhone X'];

// TODO: file should be an argument here, fetch before promise.all the posting.
//TODO: delete file from disk after post.
// TODO: figure out where to
const post = async () => {

  const browser = await puppeteer.launch({
    args: ["--no-sandbox"],
    headless: false
  })

  const page = await browser.newPage();
  await page.emulate(iPhonex);

  //TODO - env var.
  await page.goto(process.env.IG_URL)
  await page.waitForSelector('button.sqdOP.L3NKy.y3zKF');
  await page.click('button.sqdOP.L3NKy.y3zKF')

  await page.waitForSelector('input[name="username"]');
  await page.type('[name="username"]', process.env.IG_NAME, {delay: 10})
  await page.waitForSelector('input[name="password"]');
  await page.type('[name="password"]', process.env.IG_PW, {delay: 10})
  await page.type('[name="username"]', process.env.IG_NAME, {delay: 10})
  await page.click('[type="submit"]');
  //remember
  await page.waitForSelector('button.GAMXX');
  if (page.$('button.GAMXX')) {

    await page.click('button.GAMXX')
  }
  // add to home screen
  await page.waitForSelector('button.aOOlW:last-of-type');
  if (page.$('button.aOOlW:last-of-type')) {
    await page.click('button.aOOlW:last-of-type')
  }

  // await page.click('span[aria-label="New Post"]')

  // const request = require('request-promise');

  // const fileData = await request({
  //     uri: 'https://www.electricneil.com/dan-noir.jpg',
  //     encoding: 'binary'
  // });

  // fs.writeFileSync('./dan8.jpg', {encoding: 'binary'} 'fileData');


  const [fileChooser] = await Promise.all([
    page.waitForFileChooser(),
    page.click('span[aria-label="New Post"]'), // some button that triggers file selection
  ]);

  await fileChooser.accept(['./dan8.jpg'])
  await page.waitForSelector('button.UP43G');
  await page.click('button.UP43G')

  await page.waitForSelector('textarea');


  await page.type('textarea', "Neil gettin' funky!")
  await page.click('button.UP43G')

  //TODO - env vars
}
post();

import puppeteer from 'puppeteer'
import devices from 'puppeteer/DeviceDescriptors';
import dotenv from 'dotenv';
import { NeilPost } from './postRunner';
dotenv.config();

// const puppeteer = require('puppeteer')
// const devices = require('puppeteer/DeviceDescriptors')
const iPhonex = devices['iPhone X'];

export const igPost = async (neilPost: NeilPost) => {
  try {

    if (!neilPost.services.ig || !neilPost.tempImageLocation){
      console.error('Missing information for igPost');
      return;
    }

    const browser = await puppeteer.launch({
      args: ["--no-sandbox"],
      headless: false
    })

    const context = await browser.createIncognitoBrowserContext();

    await context.overridePermissions(process.env.IG_URL, ['notifications'])

    const page = await context.newPage()

    await page.emulate(iPhonex);

    await page.goto(process.env.IG_URL)

    await setLocalStorage(page);

    await page.goto(process.env.IG_URL)

    await login(page);

    //remember me prompt
    await waitAndClick('button.GAMXX', page);

    // add to home screen prompt
    // await page.waitForSelector('button.aOOlW:last-of-type', {timeout: 1000}).catch(e => 'add to home screen prompt not found');
    // if (page.$('button.aOOlW:last-of-type')) {
    //   await page.click('button.aOOlW:last-of-type')
    // }

    // Turn on notifications prompt
    // await page.waitForSelector('button.aOOlW:last-of-type', {timeout: 1000}).catch(e => 'notifications prompt not found');
    // if (page.$('button.aOOlW:last-of-type')) {
    //   await page.click('button.aOOlW:last-of-type')
    // }

    await page.waitFor(3000);

    const [fileChooser] = await Promise.all([
      page.waitForFileChooser(),
      page.click('svg[aria-label="New Post"]'), // some button that triggers file selection
    ]);

    await fileChooser.accept([neilPost.tempImageLocation])
    await page.waitForSelector('button.UP43G');
    await page.click('button.UP43G')

    await page.waitForSelector('textarea[aria-label="Write a caption…"]');


    await page.type('textarea[aria-label="Write a caption…"]', neilPost.text)
    await page.click('button.UP43G')

    await page.waitFor(3000)

    await browser.close();
  } catch(e) {
    console.log('error is', e);
  }
}

const login = async (page: puppeteer.Page) => {
  await page.waitForSelector('button.sqdOP.L3NKy.y3zKF');
  await page.click('button.sqdOP.L3NKy.y3zKF')

  await page.waitForSelector('input[name="username"]');
  await page.type('[name="username"]', process.env.IG_NAME, {delay: 10})
  await page.waitForSelector('input[name="password"]');
  await page.type('[name="password"]', process.env.IG_PW, {delay: 10})
  await page.type('[name="username"]', process.env.IG_NAME, {delay: 10})
  await page.click('[type="submit"]');

  await page.waitForNavigation();
}

const waitAndClick = async (selector: string, page: puppeteer.Page) => {
  try {
    if (!page.$(selector)) {
      await page.waitForSelector(selector, {timeout: 5000})
    }
    await page.click(selector)
  } catch (e) {
    console.log('selector did not appear', selector);
  }
}

const setLocalStorage = async (page: puppeteer.Page) => {
  await page.evaluate(() => {
    localStorage.setItem('pigeon_state', `${new Date().getTime()}`);
    localStorage.setItem('ig_a2hs_dismiss', `${new Date().setMonth(new Date().getMonth() + 1)}`);
    localStorage.setItem('one_tap_storage_version', process.env.ONE_TAP);
  });
}
// post();

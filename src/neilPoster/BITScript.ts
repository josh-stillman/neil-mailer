import puppeteer from 'puppeteer'
import dotenv from 'dotenv';
import { NeilPost } from './postRunner';
dotenv.config();

export const bitPost = async (neilPost: NeilPost) => {

  const browser = await puppeteer.launch({
    args: ["--no-sandbox"],
    headless: false
  })

  const context = await browser.createIncognitoBrowserContext();
  await context.overridePermissions(process.env.BIT_URL, ['notifications'])

  const page = await context.newPage()

  //TODO - env var.
  await page.goto(process.env.BIT_URL)

  await page.click('button.Button__Btn-sc-3cqxe3-0')
  await page.type('#loginEmail', process.env.BIT_NAME)

  //TODO - env vars
  await page.type('#loginPassword', process.env.BIT_PW)
  await page.click('[type="submit"]');
  await page.waitForSelector('textarea.Text__ArtistPostsMessageBoxText-sc-1lubkui-0');
  await page.type('textarea.Text__ArtistPostsMessageBoxText-sc-1lubkui-0', neilPost.text);

  const checkboxes = await page.$$('.Checkbox__StyledCheckbox-sc-3aet-0')

  // [bit, fb, tw]
  const { services: { bit, fb, tw } } = neilPost;

  if (!bit) {
    // uncheck
    await checkboxes[0].click()
  }

  if (fb) {
    await checkboxes[1].click()
  }
  if (tw) {
    await checkboxes[2].click()
  }

  await page.click('button.Button__Btn-sc-3cqxe3-0.iCpAnl.MainButton__StyledButton-f1zfm1-0.gTXneI')
  await page.waitForSelector('button.Button__Btn-sc-3cqxe3-0.bdFMaA.DialogButton__StyledButton-q30yea-0.chCmbC');
  await page.click('button.Button__Btn-sc-3cqxe3-0.bdFMaA.DialogButton__StyledButton-q30yea-0.chCmbC')

}
// post();

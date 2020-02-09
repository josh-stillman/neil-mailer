import puppeteer from 'puppeteer'
import dotenv from 'dotenv';
dotenv.config();

const post = async () => {

  const browser = await puppeteer.launch({
    args: ["--no-sandbox"],
    headless: false
  })

  const page = await browser.newPage()
  //TODO - env var.
  await page.goto(process.env.BIT_URL)

  await page.click('button.Button__Btn-sc-3cqxe3-0.caezgZ')
  await page.type('#loginEmail', process.env.BIT_NAME)

  //TODO - env vars
  await page.type('#loginPassword', process.env.BIT_PW)
  await page.click('[type="submit"]');
  await page.waitForSelector('textarea.Text__ArtistPostsMessageBoxText-sc-1lubkui-0');
  await page.type('textarea.Text__ArtistPostsMessageBoxText-sc-1lubkui-0', 'hello world2');

  const checkboxes = await page.$$('.Checkbox__StyledCheckbox-sc-3aet-0')

  //b, f, t
  await checkboxes[0].click()
  await checkboxes[2].click()

  await page.click('button.Button__Btn-sc-3cqxe3-0.iCpAnl.MainButton__StyledButton-f1zfm1-0.gTXneI')
  await page.waitForSelector('button.Button__Btn-sc-3cqxe3-0.bdFMaA.DialogButton__StyledButton-q30yea-0.chCmbC');
  await page.click('button.Button__Btn-sc-3cqxe3-0.bdFMaA.DialogButton__StyledButton-q30yea-0.chCmbC')

}
post();

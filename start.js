
const puppeteer = require('puppeteer');
const cred = require('./cred.js');
const escapeXpathString = str => {
  const splitedQuotes = str.replace(/'/g, `', "'", '`);
  return `concat('${splitedQuotes}', '')`;
};


const clickByText = async (page, text) => {
  const escapedText = escapeXpathString(text);
  const linkHandlers = await page.$x(`//a[contains(text(), ${escapedText})]`);
  
  if (linkHandlers.length > 0) {
    await linkHandlers[0].click();
  } else {
    throw new Error(`Link not found: ${text}`);
  }
};


const fundingcircle = async(page, browser) => {

  //Funding Circle
  await page.goto('https://www.fundingcircle.com/login');
  await page.waitFor('#user_username');

  await page.focus('#user_username');
  const credentials = cred().fc;
  await page.keyboard.type(credentials.username);
  //await page.$eval('#user_username', el => el.value = credentials.username);
  await page.focus('#user_password');
  await page.keyboard.type(credentials.password);
  //await page.$eval('#user_password', el => el.value = credentials.password);
  page.keyboard.press('Enter');
  await page.waitForNavigation({waitUntil: 'load'});

  const innerText = await page.evaluate(() => document.querySelector('.input__label--above').innerText);
  if (innerText=='What was the name of your best friend at school?') {
    await page.keyboard.type(credentials.friend);
  } else if (innerText=='Where did you grow up?') {
    await page.keyboard.type(credentials.grow);
  } else {
    await page.keyboard.type(credentials.school);
  }
  //await page.goto('http://product-recall.s3-website.eu-west-2.amazonaws.com/');
  //await clickByText(page, `View Products`);
  page.keyboard.press('Enter');
  await page.waitForNavigation({waitUntil: 'load'});
  const availableFunds = await page.evaluate(() => document.querySelector('#available-funds').innerText);
  console.log(availableFunds);


}

const ratesetter = async(page, browser) => {

  //Funding Circle
  await page.goto('https://members.ratesetter.com/login.aspx');
  await page.waitFor('#ctl00_cphContentArea_cphForm_txtEmailNew');
  await page.focus('#ctl00_cphContentArea_cphForm_txtEmailNew');

  const credentials = cred().rs;
  await page.keyboard.type(credentials.username);
  //await page.$eval('#user_username', el => el.value = credentials.username);
  await page.focus('#ctl00_cphContentArea_cphForm_txtPasswordNew');
  await page.keyboard.type(credentials.password);
  //await page.$eval('#user_password', el => el.value = credentials.password);
  page.keyboard.press('Enter');
  await page.waitForNavigation({waitUntil: 'load'});

  const availableFunds = await page.evaluate(() => document.querySelector('#ctl00_cphContentArea_cphForm_expand1_ExpanderContent > div > table > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr > td:nth-child(1)').innerText);
  console.log(availableFunds);


}




const delay = ms => new Promise(res => setTimeout(res, ms));



(async () => {
  const browser = await puppeteer.launch({headless: false,  slowMo: 50}); //devtools: true,
  const page = await browser.newPage();
  //page.on('console', (log) => console[log._type](log._text));
  
  await fundingcircle(page, browser);
  await ratesetter(page, browser);
  
  await delay(5000);
  await browser.close();
})();
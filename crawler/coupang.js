const _ = require("fxjs/Strict");
const L = require("fxjs/Lazy");
const puppeteer = require("puppeteer"); // webdriver
const fs = require("fs");
const {
  getProductTitle,
  getProductPrice,
  getOptionWrapper,
  getProdOption,
  getProductItemId,
  getProductThumbnail,
  createContext
} = require("./utils");

const getItem = async ({ context, url }) => {
  const page = await context.newPage();
  await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36");
  await page.setCacheEnabled(false);
  await page.setDefaultNavigationTimeout(0);
  await page.goto(url);
  const options = await _.go(
    { options: [] },
    getProductItemId(page),
    getProductThumbnail(page),
    getProductTitle(page),
    getProductPrice(page),
    getOptionWrapper(page),
    getProdOption(page)
  );
  await context.close();
  return options;
}

async function getProduct(url) {
  const browser = await puppeteer.launch();
  await _.go(
    url,
    createContext(browser),
    getItem,
    (e) => fs.writeFileSync("./output.json", JSON.stringify(e))
  );

  await browser.close();
}

getProduct("https://www.coupang.com/vp/products/1540038879?itemId=2638186666&vendorItemId=70629060453&sourceType=CATEGORY&categoryId=186664&isAddedCart=");

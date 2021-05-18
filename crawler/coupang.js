const _ = require("fxjs/Strict");
const L = require("fxjs/Lazy");
const puppeteer = require("puppeteer"); // webdriver
const fs = require("fs");
const {
  getProductTitle,
  getProductPrice,
  getSingleTextLable,
  getImageSelect,
  getDropDownItem,
  getDropDownLabel,
  clearCache,
  getSingleProdOption,
  getProductItemId,
  getProductThumbnail
} = require("./funcs");

const getItem = (p) =>
  _.go(
    { options: [] },
    getProductItemId(p),
    getProductThumbnail(p),
    getProductTitle(p),
    getProductPrice(p),
    getSingleTextLable(p),
    getImageSelect(p),
    getDropDownItem(p),
    getDropDownLabel(p),
    getSingleProdOption(p)
  );

// async function getProducts() {
//   const browser = await puppeteer.launch({ headless: false });
//   const page = await browser.newPage();
//   const urls = await _.go(
//     L.range(Infinity),
//     L.map(_.delay(1000)),
//     L.map((e) => `https://www.coupang.com/np/categories/186764?page=${e + 1}`),
//     L.map(clearCache(page)),
//     L.map((p) => p.$$eval(".baby-product-link", (atags) => atags.map((e) => e.href))),
//     L.takeWhile((e) => e.length !== 0),
//     _.flat
//   );

//   await _.go(
//     urls,
//     L.map(_.delay(1000)),
//     L.map(clearCache(page)),
//     L.map(getItem),
//     _.take(Infinity),
//     (e) => fs.writeFileSync("./output.json", JSON.stringify(e))
//   );

//   await browser.close();
// }

async function getProductsDev() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const urls = await _.go(
    L.range(1),
    L.map(_.delay(1000)),
    L.map((e) => `https://www.coupang.com/np/categories/186764?page=${e + 1}`),
    L.map(clearCache(page)),
    L.map((p) => p.$$eval(".baby-product-link", (atags) => atags.map((e) => e.href))),
    _.flat,
    _.take(10)
  );

  await _.go(
    urls,
    L.map(_.delay(1000)),
    L.map(clearCache(page)),
    L.map(getItem),
    _.take(Infinity),
    (e) => fs.writeFileSync("./output.json", JSON.stringify(e))
  );

  await browser.close();
}

// getProducts();

getProductsDev();

/*
1. 카테고리 목록으로 지정해놓은 애들로 들어가서 page=1 ~ page=n까지의 상품 목록들을 긁어옴
    1-1. 긁어온 url에 대해서 각 페이지의 이름, 가격, 옵션, 상세내용을 디비에 저장시킴
2. 다른 카테고리에 대해서도 똑같이 실행
*/

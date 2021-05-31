const _ = require("fxjs/Strict");
const puppeteer = require("puppeteer"); // webdriver

const { getItem, createContext, getProducts } = require("./utils");

async function getProduct(url) {
  // { headless: false, devtools:true }
  const browser = await puppeteer.launch();
  const product = await _.go(
    url,
    createContext(browser),
    getItem,
  );
  await browser.close();
  return product;
}

async function getCategoryPage(url, page){
  const browser = await puppeteer.launch();
  const products = await _.go(
    `${url}?page=${page}`,
    createContext(browser),
    getProducts,
  );
  await browser.close();
  return products;
}

module.exports = {
  getProduct,
  getCategoryPage
}

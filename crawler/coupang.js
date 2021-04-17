const _ = require("fxjs/Strict");
const L = require("fxjs/Lazy");
const puppeteer = require("puppeteer"); // webdriver

const getItem = (p) => _.go(
  { options: [] },
  async (obj) => (obj.title = await p.$eval(".prod-buy-header__title", h2 => h2.innerText), obj),
  async (obj) => (obj.price = await p.$eval(".total-price", span => span.innerText.trim()), obj),
  async (obj) => {
    const options = await p.$$eval(".single-attribute__textLabel", els => els.map(e => {
      const [label, value] = e.innerText.split(":");
      return { label, value }
    }));
    obj.options.push(...options);
    return obj;
  },
  async (obj) => {
    const options = await p.$eval(".prod-option__item", item => {
      const [label,] = item.querySelector(".imageLabel").innerText.split(":");
      const urls = Array.from(item.querySelectorAll(".Image-Select__Item__Img")).map(e => e.src);
      return { label, value: urls }
    });
    obj.options.push(...options);
    return obj;
  },
  async (obj) => {
    const options = await p.$$eval(".prod-option-dropdown-item", items => {
      return items.map(item => {
        const 
      });
    });
  },
)


async function getProducts(){
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const urls = await _.go(
    L.range(1),
    L.map(_.delay(1000)),
    L.map((e) => `https://www.coupang.com/np/categories/186764?page=${e+1}`),
    L.map(async (url) => {
      const client = await page.target().createCDPSession();
      await client.send('Network.clearBrowserCookies');
      await client.send('Network.clearBrowserCache');  
      await page.goto(url);
      return page;
    }),
    L.map((p) => p.$$eval('.baby-product-link', atags => atags.map(e => e.href))),
    _.flat,
    _.take(1),
  );

  await _.go(
    urls,
    L.map(async (url) => {
      const client = await page.target().createCDPSession();
      await client.send('Network.clearBrowserCookies');
      await client.send('Network.clearBrowserCache');  
      await page.goto(url);
      return page;
    }),
    L.map(getItem),
    _.take(3),
    _.log
  );

  await browser.close();
}

getProducts();

/*
1. 카테고리 목록으로 지정해놓은 애들로 들어가서 page=1 ~ page=n까지의 상품 목록들을 긁어옴
    1-1. 긁어온 url에 대해서 각 페이지의 이름, 가격, 옵션, 상세내용을 디비에 저장시킴
2. 다른 카테고리에 대해서도 똑같이 실행
*/

// getContent();
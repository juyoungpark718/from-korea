const _ = require("fxjs/Strict");
const L = require("fxjs/Lazy");
const puppeteer = require("puppeteer"); // webdriver
const fs = require("fs");

const checkIterable = (obj) => {
  if(obj === null) return false;
  return typeof obj[Symbol.iterator] === 'function';
}

const getItem = (p) => _.go(
  { options: [] },
  async (obj) => (obj.title = await p.$eval(".prod-buy-header__title", h2 => h2.innerText), obj),
  async (obj) => (obj.price = await p.$eval(".total-price", span => span.innerText.trim()), obj),
  async (obj) => {
    console.log("1");
    const options = await p.$$eval(".single-attribute__textLabel", els => els.map(e => {
      const [label, value] = e.innerText.split(":");
      return { label, value }
    }));
    console.log(options);
    checkIterable(options) && obj.options.push(...options);
    return obj;
  },
  async (obj) => {
    console.log("2");
    const options = await p.$$eval(".Image-Select__Container", items => {
      return items.map(item => {
        const imageLabel = item.querySelector(".imageLabel");
        const [label,] = imageLabel && imageLabel.innerText.split(":");
        const urls = Array.from(item.querySelectorAll(".Image-Select__Item__Img")).map(e => e.dataset.src);
        return { label, img: urls }
      });
    });
    console.log(options);
    checkIterable(options) &&  obj.options.push(...options);
    return obj;
  },
  async (obj) => {
    console.log("3");
    const options = await p.$$eval(".prod-option__item", items => {
      return items.map(item => {
        const values = Array.from(item.querySelectorAll(".prod-option-dropdown-item")).map(e => {
          const titleEl = e.querySelector(".prod-option__dropdown-item-title");
          const priceEl = e.querySelector(".prod-option__dropdown-item-price");
          const strongEl = priceEl && priceEl.querySelector("strong"); 
          const title = titleEl && titleEl.innerText;
          if(strongEl) return { title, price: strongEl.innerText } 
          return { title, price: priceEl.innerText };
        }); 
        return { value:values };
      });
    });
    console.log(options);
    checkIterable(options) && obj.options.push(...options.filter(e => e));
    return obj;
  },
  async (obj) => {
    console.log("4");
    const options = await p.$$eval(".prod-option__item", items => {
      return items.map(item => {
        const labelEl = item.querySelector("#Dropdown-Select__Attr-id");
        const label = labelEl && labelEl.innerText;
        const values = Array.from(item.querySelectorAll(".Dropdown-Select__Dropdown__Item")).map(e => e.innerText.trim());
        if(!label) return;
        return { label, value:values }
      });
    });
    console.log(options);
    checkIterable(options) && obj.options.push(...options.filter(e => e));
    return obj;
  },
)


async function getProducts(){
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const urls = await _.go(
    L.range(1),
    L.map(_.delay(1000)),
    L.map((e) => `https://www.coupang.com/np/categories/115674?page=${e+1}`),
    L.map(async (url) => {
      const client = await page.target().createCDPSession();
      await client.send('Network.clearBrowserCookies');
      await client.send('Network.clearBrowserCache');  
      await page.goto(url);
      return page;
    }),
    L.map((p) => p.$$eval('.baby-product-link', atags => atags.map(e => e.href))),
    _.flat,
    _.take(10),
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
    _.take(10),
    e => fs.writeFileSync("./output.json", JSON.stringify(e))
  );

  await browser.close();
}

getProducts();

/*
1. 카테고리 목록으로 지정해놓은 애들로 들어가서 page=1 ~ page=n까지의 상품 목록들을 긁어옴
    1-1. 긁어온 url에 대해서 각 페이지의 이름, 가격, 옵션, 상세내용을 디비에 저장시킴
2. 다른 카테고리에 대해서도 똑같이 실행
*/
const _ = require("fxjs/Strict");
const L = require("fxjs/Lazy");

const checkIterable = (obj) => {
  if (obj === null) return false;
  return typeof obj[Symbol.iterator] === "function";
};

// 공통 부분
const getProductThumbnail = (p) => async (obj) => {
  try {
    obj.thumbnail = await p.$eval(".prod-image__detail", (img) => img.src);
    return obj;
  } catch (error) {
    return obj;
  }
};
const getProductItemId = (p) => async (obj) => {
  try {
    obj.itemId = await p.$eval("#contents", (section) => section.dataset.productId);
    return obj;
  } catch (error) {
    return obj;
  }
};
const getProductTitle = (p) => async (obj) => {
  try {
    obj.title = await p.$eval(".prod-buy-header__title", (h2) => h2.innerText);
    return obj;
  } catch (error) {
    return obj;
  }
};
const getProductPrice = (p) => async (obj) => {
  try {
    const price = await p.$eval(".origin-price", (span) => span.innerText.replace(/\D/g, ""));
    if(price) obj.price = price;
    else obj.price = await p.$eval(".total-price", (span) => span.innerText.replace(/\D/g, ""));
    return obj;
  } catch (error) {
    return obj;
  }
};

/*
  optinos :[
    { 
      value: [{ img, title, price, content }],
    }
  ]
 */

const getOptionWrapper = (p) => async (obj) => {
  try {
    const options = await p.$eval("#optionWrapper", (wrapper) => {
      let result = [];
      let singleAttributes = [...wrapper.querySelectorAll(".single-attribute__textLabel")];
      if (singleAttributes.length !== 0) {
        singleAttributes = singleAttributes.reduce((arr, attr) => {
          const textEl = attr.querySelector(".single-attribute__text");
          textEl && arr.push({ content: textEl.innerText.trim() });
          return arr;
        }, []);
      }

      let images = [...wrapper.querySelectorAll(".Image-Select__Item")];
      if (images.length !== 0) {
        images = images.reduce((arr, image) => {
          const imgEl = image.querySelector(".Image-Select__Item__Img");
          imgEl && arr.push({ img: imgEl.dataset.src });
          return arr;
        }, []);
      }

      let dropdownItems = [...wrapper.querySelectorAll(".Dropdown-Select__Dropdown .Dropdown-Select__Dropdown__Item")];
      if (dropdownItems.length !== 0) {
        dropdownItems = dropdownItems.reduce((arr, item) => {
          arr.push({ content: item.innerText.trim() });
          return arr;
        }, []);
      }

      if(singleAttributes) result.push(...singleAttributes.map(attr => ({ value: [attr] })));
      if(images) result.push({ value: [...images] });
      if(dropdownItems) result.push({ value: [...dropdownItems] });
      return result;
    });
    checkIterable(options) && obj.options.push(...options);
    return obj;
  } catch (error) {
    return obj;
  }
};

const getProdOption = (p) => async (obj) => {
  try {
    const options = await p.$eval(".prod-option", (wrapper) => {
      let prodItems = [...wrapper.querySelectorAll(".prod-option__item")];
      if (prodItems.length !== 0) {
        prodItems = prodItems.reduce((prodItemArr, item) => {
          let selected = item.querySelector(".prod-option__selected");
          if(selected && selected.classList.contains("single")){
            let content = "";
            const title = selected.querySelector(".title");
            const value = selected.querySelector(".value");
            if(title) content += title.innerText;
            if(value && content) content += ", " + value.innerText;
            if(content) prodItemArr.push({ value: [{ content }] });
          }
          let liElList = [...item.querySelectorAll(".prod-option-dropdown-item")];
          liElList = liElList.reduce((optionArr, li) => {
            const asides = [...li.querySelectorAll(".prod-option-dropdown-item-aside")];
            if (asides.length !== 0) {
              let asideChildrens = asides.reduce((childArr, aside) => {
                childArr.push(...aside.children);
                return childArr;
              }, []);
              asideChildrens = asideChildrens.reduce((option, child) => {
                if (child.tagName === "IMG") {
                  option.img = child.src;
                  return option;
                }
                if (child.classList.contains("prod-option__dropdown-item-title")) {
                  const text = child.innerText.replace(/[\n|\s|\t]/g, "");
                  if (text) option.title = text;
                }
                if (child.classList.contains("prod-option__dropdown-item-price")) {
                  const text = child.innerText.replace(/[\n|\s|\t]/g, "");
                  if (text) option.price = text.replace(/\D/g, '');
                  return option;
                }
                return option;
              }, {});
              optionArr.push(asideChildrens);
            }
            return optionArr;
          }, []);
          if(liElList.length) prodItemArr.push({ value: [...liElList] });
          return prodItemArr;
        }, []);
      }
      return prodItems;
    });
    checkIterable(options) && obj.options.push(...options);
    return obj;
  } catch (error) {
    return obj;
  }
};

const crawlProducts = async (page) => {
  try{
    const products = await page.$$eval(".baby-product-link", (aTags) => {
      const data = aTags.map((aTag) => {
        const productUrl = aTag.href;
        const imgEl = aTag.querySelector(".image");
        const imgUrl = imgEl && imgEl.children[0].src;
        const titleEl = aTag.querySelector(".name");
        const title = titleEl && titleEl.innerText.trim();
        const priceEl = aTag.querySelector(".price");
        const basePriceEl = priceEl && priceEl.querySelector(".base-price");
        const basePrice = basePriceEl && basePriceEl.innerText.trim();
        return { url:productUrl, img:imgUrl, title, price:basePrice ? basePrice : priceEl.innerText.trim() };
      });
      return data;
    });
    return products;
  }catch(error){
    return [];
  }
}

const createContext = (browser) => async (url) => {
  const context = await browser.createIncognitoBrowserContext();
  return { context, url };
}

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
    _.delay(500),
    getOptionWrapper(page),
    getProdOption(page)
  );
  await context.close();
  return options;
}

const getProducts = async ({ context, url }) => {
  const page = await context.newPage();
  await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36");
  await page.setCacheEnabled(false);
  await page.setDefaultNavigationTimeout(0);
  await page.goto(url);

  const products = await crawlProducts(page);
  await context.close();
  return products;
}

module.exports = {
  createContext,
  getItem,
  getProducts
}
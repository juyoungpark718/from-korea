const _ = require("fxjs/Strict");
const L = require("fxjs/Lazy");

const checkIterable = (obj) => {
  if (obj === null) return false;
  return typeof obj[Symbol.iterator] === "function";
};

const setUserAgent = (page) => async (url) => {
  await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36");
  await page.goto(url);
  return page;
};

const createContext = (browser) => async (url) => {
  const context = await browser.createIncognitoBrowserContext();
  return { context, url };
}

// 공통 부분
const getProductThumbnail = (p) => async (obj) => {
  try {
    obj.thumnbail = await p.$eval(".prod-image__detail", (img) => img.src);
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
    obj.price = await p.$eval(".total-price", (span) => span.innerText.trim());
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
      return [
        { value: [...singleAttributes] },
        { value: [...images] },
        { value: [...dropdownItems] },
      ];
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
                  if (text) option.price = text;
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
    console.log(options);
    checkIterable(options) && obj.options.push(...options);
    return obj;
  } catch (error) {
    return obj;
  }
};

module.exports = {
  getProductItemId,
  getProductThumbnail,
  getProductTitle,
  getProductPrice,
  getOptionWrapper,
  getProdOption,
  setUserAgent,
  createContext,
};

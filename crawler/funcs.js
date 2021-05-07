const checkIterable = (obj) => {
  if(obj === null) return false;
  return typeof obj[Symbol.iterator] === 'function';
}

const clearCache = (page) => async (url) => {
  const client = await page.target().createCDPSession();
  await client.send('Network.clearBrowserCookies');
  await client.send('Network.clearBrowserCache');  
  await page.goto(url);
  return page;
};

const getProductTitle = (p) => async (obj) => ((obj.title = await p.$eval(".prod-buy-header__title", (h2) => h2.innerText)), obj);
const getProductPrice = (p) => async (obj) => ((obj.price = await p.$eval(".total-price", (span) => span.innerText.trim())), obj);
const getSingleTextLable = (p) => async (obj) => {
  const options = await p.$$eval(".single-attribute__textLabel", (els) =>
    els.map((e) => {
      const [label, value] = e.innerText.split(":");
      return { label, value };
    })
  );
  checkIterable(options) && obj.options.push(...options);
  return obj;
};
const getImageSelect = (p) => async (obj) => {
  const options = await p.$$eval(".Image-Select__Container", (items) => {
    return items.map((item) => {
      const imageLabel = item.querySelector(".imageLabel");
      const [label] = imageLabel && imageLabel.innerText.split(":");
      const urls = Array.from(item.querySelectorAll(".Image-Select__Item__Img")).map(
        (e) => e.dataset.src
      );
      return { label, img: urls };
    });
  });
  checkIterable(options) && obj.options.push(...options);
  return obj;
};

const getDropDownItem = (p) => async (obj) => {
  const options = await p.$$eval(".prod-option__item", (items) => {
    return items.map((item) => {
      const values = Array.from(item.querySelectorAll(".prod-option-dropdown-item")).map((e) => {
        const titleEl = e.querySelector(".prod-option__dropdown-item-title");
        const priceEl = e.querySelector(".prod-option__dropdown-item-price");
        const strongEl = priceEl && priceEl.querySelector("strong");
        const title = titleEl && titleEl.innerText;
        if (strongEl && strongEl.innerText.replace(/[\s\n]/g, "")) return { title, price: strongEl.innerText };
        if (!priceEl.innerText.replace(/[\s\n]/g, "")) return { title };
        return { title, price: priceEl.innerText };
      });
      return { value: values };
    });
  });
  checkIterable(options) && obj.options.push(...options.filter((e) => e && e.value.length));
  return obj;
};

const getDropDownLabel = (p) => async (obj) => {
  const options = await p.$$eval(".prod-option__item", (items) => {
    return items.map((item) => {
      const labelEl = item.querySelector("#Dropdown-Select__Attr-id");
      const label = labelEl && labelEl.innerText;
      const values = Array.from(
        item.querySelectorAll(".Dropdown-Select__Dropdown__Item")
      ).map((e) => e.innerText.trim());
      if (!label) return;
      return { label, value: values };
    });
  });

  checkIterable(options) && obj.options.push(...options.filter((e) => e && e.value.length));
  return obj;
};

module.exports = {
  getProductTitle, 
  getProductPrice, 
  getSingleTextLable, 
  getImageSelect, 
  getDropDownItem, 
  getDropDownLabel,
  clearCache
}

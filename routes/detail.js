const express = require("express");
const router = express.Router();
const Layout = require("../views/layout");
const Detail = require("../views/detail");
const { getProduct } = require("../crawler/coupang");

router.get("/", csrfProtection, async (req, res, next) => {
  const { url } = req.query;
  const { user } = req.session;
  const csrf = req.csrfToken();
  const product = JSON.parse(`{"options":[{"value":[{"content":"FREE"},{"content":"블랙"}]},{"value":[]},{"value":[]}],"itemId":"1583623796","thumbnail":"https://thumbnail6.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/59692374173864-9cb54060-3235-4717-b81b-395bdabfe0d1.jpg","title":"캐럿 여성 와이드 밴딩 쿨링 팬츠","price":"9990"}`);
  // const product = await getProduct(url);
  // console.log(JSON.stringify(product));
  res.send(
    Layout.render({
      title: product.title,
      user,
      body: Detail.render(product, csrf),
      styles: [styleSheet`detail/style.css`],
      scripts: [script`detail/index.js`]
    })
  );
});

module.exports = router;
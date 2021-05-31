const express = require("express");
const router = express.Router();
const Layout = require("../views/layout");
const Detail = require("../views/detail");
const { getProduct } = require("../crawler/coupang");

router.get("/", async (req, res, next) => {
  const { url } = req.query;
  const product = JSON.parse(`{"options":[{"value":[{"content":"사이즈, FREE"}]},{"value":[{"img":"https://thumbnail10.coupangcdn.com/thumbnails/remote/48x48ex/image/retail/images/2020/05/04/11/4/e81f8b7c-9e68-4712-9722-e5ee41c06130.jpg","title":"Black","price":"11,900원"},{"img":"https://thumbnail7.coupangcdn.com/thumbnails/remote/48x48ex/image/retail/images/2020/05/04/11/3/ab045f6f-c395-4b20-ade7-7e45b34c3a81.jpg","title":"White","price":"11,900원"}]}],"itemId":"1540038879","thumbnail":"https://thumbnail10.coupangcdn.com/thumbnails/remote/492x492ex/image/retail/images/2020/05/04/11/4/e81f8b7c-9e68-4712-9722-e5ee41c06130.jpg","title":"K2 심리스 쿨토시 2p x 2세트","price":"11,900원"}`);
  // const product = await getProduct(url);
  res.send(
    Layout.render({
      title: product.title,
      body: Detail.render(product),
      styles: [styleSheet`detail/style.css`]
    })
  );
});

module.exports = router;
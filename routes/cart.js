const express = require("express");
const router = express.Router();
const Layout = require("../views/layout");
const Cart = require("../views/cart");
const cartService = require("../services/cart");

router.get("/", privateRouter, async (req, res) => {
  const { user } = req.session;
  res.send(
    Layout.render({
      title:"FROM. Korea | Cart",
      user,
      body: Cart.render(),
      styles: [styleSheet`cart/style.css`],
      scripts: [
        `<script src='https://www.paypal.com/sdk/js?client-id=${process.env.PAYPAL_CLIENT_ID}&currency=USD'></script>`, 
        script`cart/index.js`
      ]
    })
  );
});

module.exports = router;
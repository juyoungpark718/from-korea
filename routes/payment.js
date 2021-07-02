const express = require('express');
const router = express.Router();
const _ = require("fxjs/Strict");
const Layout = require("../views/layout");
const Payment = require("../views/payment")

router.get('/', privateRouter, async (req, res) => {
  const { user } = req.session;
  res.send(
    Layout.render({
      title:"Payment",
      user,
      body: Payment.render(),
      styles: [styleSheet`payment/style.css`],
      scripts: [script`payment/index.js`]
    })
  );
});

module.exports = router;

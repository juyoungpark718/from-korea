const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const paymentService = require("../services/payment");
const cartService = require("../services/cart");
const productService = require("../services/product");
const _ = require("fxjs/Strict");

const API = process.env.PAYPAL_API;

router.post("/paypal/order/create", privateRouter, async (req, res) => {
  const { user } = req.session;
  const { id:userId } = user;
  const { intent, purchase_units } = req.body;
  if(!user){
    res.status(401).send();
    return;
  }
  if(purchase_units.length === 0 || !intent){
    res.status(400).send();
    return;
  }
  const data = await _.go(
    paymentService.getAccessTokenPayPal(),
    ({ access_token }) => access_token,
    paymentService.createPaypalOrder({ intent, purchase_units }),
  );
  console.log(data);
  res.send(data);
});

router.post("/paypal/order/:orderId/capture", privateRouter, async (req, res) => {
  const { facilitatorAccessToken } = req.body;
  const { orderId } = req.params;
  const { carts } = req.query;
  const { user } = req.session;
  const { id:userId } = user;

  if(!orderId){
    res.status(400).send();
    return ;
  }
  const data = await fetch(`${API}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers:{
      Authorization: `Bearer ${facilitatorAccessToken}`,
      'Content-Type': 'application/json'
    },
  }).then(res => res.json());

  if(data.error){
    res.status(401).send();
    return;
  }

  const amount = _.go(
    data.purchase_units,
    _.map(({ payments }) => payments.captures),
    _.flat,
    _.map(({ amount }) => amount.value),
    _.reduce(_.add)
  );
  
  await _.go(
    paymentService.createPayment({ userId, amount, orderId }),
    ({ insertId }) => insertId,
    (paymentId) => {
      return _.go(
        carts,
        _.split(","),
        cartService.findCartsByIds,
        productService.createProducts(paymentId)
      )
    },
    () => _.go(
      carts,
      _.split(","),
      cartService.deleteCarts,
    )
  );
  res.send(data);
});

router.get("/", privateRouter, async (req, res) => {
  const { user } = req.session;
  const payments = await paymentService.findPaymentsWithProductsByUserId(user.id);
  res.send({ payments });
});

module.exports = router;
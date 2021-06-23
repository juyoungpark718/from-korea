const express = require("express");
const router = express.Router();
const cartService = require("../services/cart");

router.get("/", csrfProtection, async (req, res) => {
  const { user } = req.session;
  const csrf = req.csrfToken();
  const carts = await cartService.getCartsByUserId(user.id);
  res.send({ carts, csrf });
});

router.post("/", csrfProtection, async (req, res) => {
  const { user } = req.session;
  const product  = req.body;
  if(!user){
    res.redirect("/user");
    return;
  }
  product.userId = user.id;
  const cart = await cartService.createOrUpdateCart(product);
  if(!cart){
    res.status(400).send();
    return;
  }
  res.status(201).send({});
});

router.post("/:id", csrfProtection, async (req, res) => {
  if(!req.session.user){
    res.redirect("/user");
    return;
  }
  const { id } = req.params;
  const { count } = req.body;
  console.log(id, count);
  // const cart = await cartService.updateCart({ id, count });
  res.status(200).send({ ok:true });
});

module.exports = router;
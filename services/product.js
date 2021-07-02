const _ = require("fxjs/Strict");
const productModel = require("../models/product");

const createProducts = paymentId => carts => {
  const keys = [
    "productUrl",
    "productId",
    "productName",
    "productPrice",
    "productOptions",
    "productThumbnail",
    "count",
    "userId",
  ];
  
  return _.go(
    carts,
    _.map(_.pick(keys)),
    _.map(cart => ({ ...cart, paymentId })),
    productModel.createProducts
  )
}

module.exports = {
  createProducts
}
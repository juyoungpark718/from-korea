const _ = require("fxjs/Strict");
const cartModel = require("../models/cart");

const getCartsByUserId = (userId) => cartModel.findCarts({ userId });

const createCart = (cartInfo) => {
  const { productUrl, productId, productName, productThumbnail, productHash, productPrice, productOptions, userId, count } = cartInfo;
  // const productHash = makeHash()
  return cartModel.createCart({
    productUrl,
    productId,
    productName,
    productPrice,
    productThumbnail,
    productOptions,
    productHash,
    userId,
    count
  });
};

const findCartByHash = ({ userId, productHash }) => {
  _.log(userId, productHash);
 return cartModel.findCartByHash({ userId, productHash });
}

const updateCart = ({ id, count }) => cartModel.updateCart({ id, count }) 

const createOrUpdateCart = async (product) => {
  const productOptions = getCartOptions(product);
  const productHash = hashCode(`${product.productId}${productOptions}`);
  product.productOptions = productOptions;
  product.productHash = productHash;
  const cart = await _.go(
    product,
    findCartByHash,
    _.head,
    _.ifElse(
      cart => cart === undefined,
      () => createCart(product),
      cart => updateCart({ id:cart.id, count: Number(product.count) + cart.count }),
    ),
  );
  return cart;
}

module.exports = {
  getCartsByUserId,
  createOrUpdateCart,
  updateCart,
}
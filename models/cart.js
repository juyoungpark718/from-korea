
const _ = require("fxjs/Strict");

FxSQL_DEBUG = true;

const createCart = async ({ productUrl, productId, productName, productPrice, productThumbnail, productHash, productOptions, userId, count }) => {
  const { QUERY, COMMIT, ROLLBACK } = await TRANSACTION();
  try{
    const cart = await QUERY `INSERT INTO carts ${VALUES({
      productUrl,
      productId,
      productName,
      productPrice,
      productThumbnail,
      productOptions,
      productHash,
      count: Number(count),
      userId
    })}`;
    await COMMIT();
    return cart;
  }catch(e){
    await ROLLBACK();
    return undefined;
  }
}

const findCarts = async ({ userId }) => {
  try{
    const carts = await QUERY `SELECT * FROM carts WHERE ${EQ({ userId })}`;
    return carts;
  }catch(e){
    return [];
  }
}

const findCartByHash = async ({ userId, productHash }) => {
  try{
    const carts = await QUERY `SELECT * FROM carts WHERE ${EQ({ userId, productHash })}`;
    return carts;
  }catch(e){
    return undefined;
  }
}

const updateCart = async ({ id, count }) => {
  const { QUERY, COMMIT, ROLLBACK } = await TRANSACTION();
  try{
    const cart = await QUERY `UPDATE carts ${SET({ count })} WHERE ${EQ({ id })}`
    await COMMIT();
    return cart;
  }catch(e){
    await ROLLBACK();
    return undefined;
  }
}



module.exports = {
  createCart,
  findCarts,
  findCartByHash,
  updateCart
}

const _ = require("fxjs/Strict");

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

const findCartsByUserId = async ({ userId }) => {
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

const findCartsByIds = async (ids) => {
  try{
    const carts = await QUERY `SELECT * FROM carts WHERE ${IN('id', ids)}`;
    return carts;
  }catch(e){
    return [];
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

const deleteCarts = async (ids) => {
  const { QUERY, COMMIT, ROLLBACK } = await TRANSACTION();
  try{
    const deleted = await QUERY `DELETE FROM carts WHERE ${IN('id', ids)}`;
    await COMMIT();
    return deleted;
  }catch(e){
    await ROLLBACK();
    return undefined;
  }
}



module.exports = {
  createCart,
  findCartsByUserId,
  findCartByHash,
  findCartsByIds,
  updateCart,
  deleteCarts
}
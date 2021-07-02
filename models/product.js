
const _ = require("fxjs/Strict");

const createProducts = async (products) => {
  const { QUERY, COMMIT, ROLLBACK } = await TRANSACTION();
  try{
    const product = await QUERY `INSERT INTO products ${VALUES(products)}`;
    await COMMIT();
    return product;
  }catch(e){
    await ROLLBACK();
    return undefined;
  }
}

module.exports = {
  createProducts,
}

const _ = require("fxjs/Strict");

const createPayment = async ({ amount, orderId, userId }) => {
  const { QUERY, COMMIT, ROLLBACK } = await TRANSACTION();
  try{
    const payment = await QUERY `INSERT INTO payments ${VALUES({ amount, orderId, userId })}`;
    await COMMIT();
    return payment;
  }catch(e){
    await ROLLBACK();
    return undefined;
  }
}

const findPaymentByOrderId = async (orderId) => {
  try{
    const payment = await QUERY `SELECT * FROM payments WHERE ${EQ({ orderId })}`
    return payment;
  }catch(e){
    return undefined;
  }
}

const findPaymentsWithProductsByUserId = async (userId) => {
  try{
    FxSQL_DEBUG.LOG = true;
    const payments = await ASSOCIATE `
      payments ${SQL `WHERE userId = ${userId}`}
        < products ${{
          key: 'paymentId',
        }}`;
    return payments;
  }catch(e){
    console.log(e);
    return [];
  }
}

module.exports = {
  createPayment,
  findPaymentByOrderId,
  findPaymentsWithProductsByUserId
}
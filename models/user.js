const _ = require("fxjs/Strict");

const createUser = async (userInfo) => {
  const { QUERY, COMMIT, ROLLBACK } = await TRANSACTION();
  try{
    const user = _.go(
      await QUERY `INSERT INTO users ${VALUES({ ...userInfo })}`,
      _.pick(["insertId"]),
      async ({ insertId }) => await QUERY `SELECT * FROM users WHERE id = ${insertId}`,
      _.head
    );
    await COMMIT();
    return user;
  }catch(e){
    await ROLLBACK();
    return undefined;
  }
}

const findUser = async ({ email, fbId }) => await QUERY `SELECT * from users WHERE ${EQ(email ? { email } : { fbId })}`

module.exports = {
  createUser,
  findUser
}
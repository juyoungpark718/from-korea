const _ = require("fxjs/Strict");

const createUser = async ({ email, name, picture }) => {
  const { QUERY, COMMIT, ROLLBACK } = await TRANSACTION();
  try{
    const user = _.go(
      await QUERY `INSERT INTO users ${VALUES({ email, name, picture })}`,
      _.pick(["insertId"]),
      _.head,
      async (id) => await QUERY `SELECT * FROM users WHERE id = ${id}`
    );
    await COMMIT();
    return user;
  }catch(e){
    await ROLLBACK();
    return undefined;
  }
}

const findUser = async ({ email }) => await QUERY `SELECT * from users WHERE ${EQ({ email })}`

module.exports = {
  createUser,
  findUser
}
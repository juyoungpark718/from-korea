const { MySQL: { CONNECT } } = require("fxsql");
const DB = CONNECT({
  host: process.env.DB_HOST,
  user     : process.env.DB_USERNAME,
  password : process.env.DB_PASSWORD,
  database : process.env.DB_NAME,
});

DB.FxSQL_DEBUG.ERROR_WITH_SQL = true;
global.FxSQL_DEBUG = DB.FxSQL_DEBUG;
global.VALUES = DB.VALUES;
global.IN = DB.IN;
global.NOT_IN = DB.NOT_IN;
global.EQ = DB.EQ;
global.SET = DB.SET;
global.COLUMN = DB.COLUMN;
global.CL = DB.CL;
global.TABLE = DB.TABLE;
global.TB = DB.TB;
global.SQL = DB.SQL;
global.SQLS = DB.SQLS;
global.QUERY = DB.QUERY;
global.ASSOCIATE = DB.ASSOCIATE;
global.ASSOCIATE_MODULE = DB.ASSOCIATE_MODULE;
global.TRANSACTION = DB.TRANSACTION;
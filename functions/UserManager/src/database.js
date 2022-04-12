const { Pool } = require("pg");
require("dotenv").config();
const connectionString = process.env.PSQL_CONNECTION ?? "postgres://anmwrlvj:dr2bCB0CP5NiHkcD80as0X5BCJm2s1BE@batyr.db.elephantsql.com/anmwrlvj";
const pool = new Pool({
  connectionString,
});

module.exports = {
  pool: pool,
  query: (text, params) => pool.query(text, params),
};
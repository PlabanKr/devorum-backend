const pg = require("pg");
const Pool = pg.Pool;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false, // Allow self-signed certificates
  },
});

module.exports = pool;

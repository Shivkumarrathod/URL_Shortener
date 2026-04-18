import { Pool } from "pg";

const pool = new Pool({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
})

pool.on('error', (err) => {
  console.error('Unexpected DB pool error', err);
  process.exit(1);
});

export default pool;
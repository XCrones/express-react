import pg from "pg";

export const PoolPSQL = new pg.Pool({
  user: "admin",
  password: "root",
  host: "localhost",
  port: 5432,
  database: "postgres",
});

import { randomUUID } from "crypto";
import Postgres from "pg";

const pool = new Postgres.Pool({
  host: "containers-us-west-155.railway.app", //"localhost",
  port: 5459, //5433,
  user: "postgres", //test,
  password: "clHji8ptWTTiOHo81EMv", //"test",
  database: "railway", //"test",

  max: 20,
  // idleTimeoutMillis: 30000,
  // connectionTimeoutMillis: 2000,
  //PGPASSWORD=0EPEQ3oq28IuXejH86Sk psql -h containers-us-west-156.railway.app -U postgres -p 6465 -d railway
});

/**
 *
 * @param {String} text - The Text of the Query to be Executed (SQL CODE).
 * @param {String} params - The Parameters to be Passed with the Query. ie $1 $2, etc..
 *
 * credit: https://node-postgres.com/guides/project-structure#example
 * @example
 * postgresQuery(`SELECT * FROM "User"`, [])
  .then((res) => {
    console.table(res.rows);
  })
  .catch((err) => {
    console.log(err);
  });
 * 
 * @returns Promise of postgres query result
 */
export const postgresQuery = async (text: string, params: any[]) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log("executed,  query", { text, duration, rows: res.rowCount });
  return { rows: res.rows, rowCount: res.rowCount };
};

// export default {
//   async query(text: string, params: any[]) {
//     const start = Date.now();
//     const res = await pool.query(text, params);
//     const duration = Date.now() - start;
//     console.log("executed query", { text, duration, rows: res.rowCount });
//     return res;
//   },
// };

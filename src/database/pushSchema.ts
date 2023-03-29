import { postgresQuery } from "./db";
import * as fs from "fs";
const pushSchema = async () => {
  // read the schema file
  fs.readFile("src/database/schema2.sql", async (err, data) => {
    if (err) throw err;
    await postgresQuery(data.toString(), []);
  });
};

pushSchema();

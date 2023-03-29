import { postgresQuery } from "./db";

const dropSchema = async () => {
  await postgresQuery("DROP SCHEMA public CASCADE", []);
  await postgresQuery("CREATE SCHEMA public", []);
};

dropSchema();

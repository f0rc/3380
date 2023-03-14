import { postgresQuery } from "src/database/db";

export const getPackage = async () => {
  // select packages 10 at a time where status is == accepted and in transit
  const getPackage = await postgresQuery(
    `select * from "Package_Location_History" where "status" = $1 OR "status" = $2 limit 10`,
    ["Accepted", "In Transit"]
  );
  console.log(getPackage.rows);
};

getPackage();

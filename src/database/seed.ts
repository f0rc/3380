// create admin with argon 2 password hased
// create packages, customers

import { hash } from "argon2";
import { randomUUID } from "crypto";
import { postgresQuery } from "./db";

const createAdmin = async () => {
  // const email = "admin3@admin.com";
  // const password = "admin3@admin.com";
  // const customerUUID = "f2c74d34-ec08-46a9-9dea-ece5b83025dd";
  // const employeeUUDI = "5ef66dde-1007-43d7-b6bf-ca8fdce4a836";
  // const hashedPassword = await hash(password);
  // const senderID = await postgresQuery(
  //   `INSERT INTO "CUSTOMER" ("customer_id", "firstname", "lastname", "email", "phoneNumber", "address_street", "address_city", "address_state", "address_zipcode", "createdBy", "updatedBy") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING "customer_id" as reciverID`,
  //   [
  //     customerUUID, //##TODO: make this a uuid in the db automatically /1
  //     "admin", //2
  //     "ADMINCEO", //3
  //     email, //4
  //     "123456789", //5
  //     "123 kitty drive", //6
  //     "fakeCity", //7
  //     "fakeState", //8
  //     111111, //9
  //     "fuckoff", // employeeID /10
  //     "fuckoff", // employeeID /11
  //   ]
  // );
  // const adminID = await postgresQuery(
  //   `INSERT INTO "USER" ("user_id","email", "password", "role") VALUES ($1, $2, $3, $4) RETURNING user_id`,
  //   [randomUUID(), email, hashedPassword, 4]
  // );
  // const createEmployee = await postgresQuery(
  //   `INSERT INTO "EMPLOYEE" ("employee_id", "email","firstname", "lastname", "birthdate", "role", "salary", "postoffice_location_id", "address_street", "address_city", "address_state", "address_zipcode", "startdate" , "createdBy", "updatedBy") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING "employee_id" as empID`,
  //   [
  //     randomUUID(), //##TODO: make this a uuid in the db automatically /1
  //     email, //4
  //     "admin", //2
  //     "ADMINCEO", //3
  //     "12 / 20 / 1990", //5
  //     1,
  //     "1000000", //9
  //     "999666",
  //     "123 kitty drive", //6
  //     "fakeCity", //7
  //     "fakeState", //8
  //     111111, //9
  //     "12 / 20 / 1990", //5
  //     "fuckoff", // employeeID /10
  //     "fuckoff", // employeeID /11
  //   ]
  // );
  // const createPackage = await postgresQuery(
  //   `INSERT INTO "PACKAGE" ("package_id", "cost", "weight", "type", "size", "sender_id", "receiver_id", "createdBy", "updatedBy") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING "package_id" as packageID`,
  //   [
  //     randomUUID(), //##TODO: make this a uuid in the db automatically /1
  //     1, //2
  //     1, //5
  //     "box", //3
  //     "small", //4
  //     customerUUID, //2
  //     customerUUID, //3
  //     employeeUUDI,
  //     employeeUUDI,
  //   ]
  // );
  const testinggg = await postgresQuery(
    `SELECT p.*, plh.*
    FROM "PACKAGE" p
    INNER JOIN (
        SELECT package_id, MAX("processedAt") AS latest_date
        FROM "PACKAGE_LOCATION_HISTORY"
        GROUP BY package_id
    ) plh2 ON p.package_id = plh2.package_id
    INNER JOIN "PACKAGE_LOCATION_HISTORY" plh
        ON plh.package_id = plh2.package_id
        AND plh."processedAt" = plh2.latest_date`,
    []
  );
  console.log(testinggg.rows);
};

createAdmin();

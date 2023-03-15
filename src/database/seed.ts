// create admin with argon 2 password hased
// create packages, customers

import { hash } from "argon2";
import { randomUUID } from "crypto";
import { postgresQuery } from "./db";

const createAdmin = async () => {
  const email = "admin3@admin.com";
  const password = "admin3@admin.com";

  const hashedPassword = await hash(password);

  // const senderID = await postgresQuery(
  //   `INSERT INTO "Customers" ("customerID", "firstName", "lastName", "email", "phoneNumber", "address_street", "address_city", "address_state", "address_zipcode", "createdBy", "updatedBy") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING "customerID" as reciverID`,
  //   [
  //     randomUUID(), //##TODO: make this a uuid in the db automatically /1
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
  //   `INSERT INTO "Users" ("id", "name","email", "password", "role") VALUES ($1, $2, $3, $4, $5) RETURNING id`,
  //   [randomUUID(), "admin", email, hashedPassword, 4]
  // );

  // const createEmployee = await postgresQuery(
  //   `INSERT INTO "Employee" ("id", "email","firstName", "lastName", "birthDate", "role", "salary", "locationID", "address_street", "address_city", "address_state", "address_zipcode", "startDate" , "createdBy", "updatedBy") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING "id" as empID`,
  //   [
  //     randomUUID(), //##TODO: make this a uuid in the db automatically /1
  //     email, //4
  //     "admin", //2
  //     "ADMINCEO", //3
  //     "12 / 20 / 1990", //5
  //     1,
  //     "1000000", //9
  //     "fuckj off",
  //     "123 kitty drive", //6
  //     "fakeCity", //7
  //     "fakeState", //8
  //     111111, //9
  //     "12 / 20 / 1990", //5
  //     "fuckoff", // employeeID /10
  //     "fuckoff", // employeeID /11
  //   ]
  // );
  const createEmployee = await postgresQuery(
    `INSERT INTO "Employee" ("id", "email","firstName", "lastName", "birthDate", "role", "salary", "locationID", "address_street", "address_city", "address_state", "address_zipcode", "startDate" , "createdBy", "updatedBy") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING "id" as empID`,
    [
      randomUUID(), //##TODO: make this a uuid in the db automatically /1
      email, //4
      "admin", //2
      "ADMINCEO", //3
      "12 / 20 / 1990", //5
      2,
      "1000000", //9
      "fuckj off",
      "123 kitty drive", //6
      "fakeCity", //7
      "fakeState", //8
      111111, //9
      "12 / 20 / 1990", //5
      "fuckoff", // employeeID /10
      "fuckoff", // employeeID /11
    ]
  );
};

createAdmin();

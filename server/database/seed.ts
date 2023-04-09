// create admin with argon 2 password hased
// create packages, customers

import { hash } from "argon2";
import { randomUUID } from "crypto";
import { postgresQuery } from "./db";

const createAdmin = async () => {
  const email = "admin3@admin.com";
  const password = "admin3@admin.com";
  const customerUUID = "f2c74d34-ec08-46a9-9dea-ece5b83025dd";
  const employeeUUDI = "5ef66dde-1007-43d7-b6bf-ca8fdce4a836";
  const hashedPassword = await hash(password);
  const senderID = await postgresQuery(
    `INSERT INTO "CUSTOMER" ("customer_id", "firstname", "lastname", "email", "phoneNumber", "address_street", "address_city", "address_state", "address_zipcode", "createdBy", "updatedBy") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING "customer_id" as reciverID`,
    [
      customerUUID, //##TODO: make this a uuid in the db automatically /1
      "admin", //2
      "ADMINCEO", //3
      email, //4
      "123456789", //5
      "123 kitty drive", //6
      "fakeCity", //7
      "fakeState", //8
      111111, //9
      "fuckoff", // employeeID /10
      "fuckoff", // employeeID /11
    ]
  );
  const adminID = await postgresQuery(
    `INSERT INTO "USER" ("user_id","email", "password", "role") VALUES ($1, $2, $3, $4) RETURNING user_id`,
    [randomUUID(), email, hashedPassword, 4]
  );
  const createEmployee = await postgresQuery(
    `INSERT INTO "EMPLOYEE" ("employee_id", "email","firstname", "lastname", "birthdate", "role", "salary", "address_street", "address_city", "address_state", "address_zipcode", "startdate" , "createdBy", "updatedBy") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING "employee_id" as empID`,
    [
      randomUUID(), // employee_id
      email, // email
      "admin", //firstname
      "ADMINCEO", //last name
      "12 / 20 / 1990", //birthdate
      4, // role
      "1000000", //salary
      "123 kitty drive", //address sttreet
      "fakeCity", // address city
      "fakeState", // address state
      111111, // address zipcode
      "12 / 20 / 1990", //start date
      "fuckoff", // createdBY
      "fuckoff", // updatedBy
    ]
  );
  const createAdminWorksFor = await postgresQuery(
    `INSERT INTO "WORKS_FOR" ("employee_id") VALUES ($1)`,
    [createEmployee.rows[0].empid]
  );
};

createAdmin();

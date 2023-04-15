// create admin with argon 2 password hased
// create packages, customers

import { hash } from "argon2";
import { randomUUID } from "crypto";
import { postgresQuery } from "./db";

const createAdmin = async () => {
  const email = "admin@admin.com";
  const password = "admin@admin.com";
  const customerUUID = "f2c74d34-ec08-46a9-9dea-ece5b83025dd";
  const employeeUUDI = "5ef66dde-1007-43d7-b6bf-ca8fdce4a836";
  const hashedPassword = await hash(password);
  const senderID = await postgresQuery(
    `INSERT INTO "CUSTOMER" ("customer_id", "firstname", "lastname", "email", "phoneNumber", "address_street", "address_city", "address_state", "address_zipcode", "createdBy", "updatedBy") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING "customer_id" as reciverID`,
    [
      customerUUID, //##TODO: make this a uuid in the db automatically /1
      "George", //2
      "Fischer", //3
      email, //4
      "8324174232", //5
      "123 houston dr", //6
      "houston", //7
      "tx", //8
      77842, //9
      "ADMIN", // employeeID /10
      "ADMIN", // employeeID /11
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
      "George", //firstname
      "Fischer", //last name
      "12 / 20 / 1990", //birthdate
      4, // role
      "1000000", //salary
      "123 houston dr", //address sttreet
      "houston", // address city
      "tx", // address state
      77842, // address zipcode
      "04 / 04 / 2023", //start date
      "ADMIN", // createdBY
      "ADMIN", // updatedBy
    ]
  );
  const createAdminWorksFor = await postgresQuery(
    `INSERT INTO "WORKS_FOR" ("employee_id") VALUES ($1)`,
    [createEmployee.rows[0].empid]
  );
};

createAdmin();

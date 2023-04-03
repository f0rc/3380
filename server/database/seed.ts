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
  //   [randomUUID(), email, hashedPassword, 3]
  // );
  // const createEmployee = await postgresQuery(
  //   `INSERT INTO "EMPLOYEE" ("employee_id", "email","firstname", "lastname", "birthdate", "role", "salary", "address_street", "address_city", "address_state", "address_zipcode", "startdate" , "createdBy", "updatedBy") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING "employee_id" as empID`,
  //   [
  //     randomUUID(), // employee_id
  //     email, // email
  //     "admin", //firstname
  //     "ADMINCEO", //last name
  //     "12 / 20 / 1990", //birthdate
  //     3, // role
  //     "1000000", //salary
  //     "123 kitty drive", //address sttreet
  //     "fakeCity", // address city
  //     "fakeState", // address state
  //     111111, // address zipcode
  //     "12 / 20 / 1990", //start date
  //     "fuckoff", // createdBY
  //     "fuckoff", // updatedBy
  //   ]
  // );
  // const createAdminWorksFor = await postgresQuery(
  //   `INSERT INTO "WORKS_FOR" ("employee_id", "postoffice_location_id") VALUES ($1, $2)`,
  //   [createEmployee.rows[0].empid, -1]
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
  // const testinggg = await postgresQuery(
  //   `SELECT
  //   E.*,
  //   M.lastname AS manager_lastname,
  //   PL.locationname AS postoffice_locationname,
  //   PL.address_street AS postoffice_address_street,
  //   PL.address_city AS postoffice_address_city,
  //   PL.address_state AS postoffice_address_state,
  //   PL.address_zipcode AS postoffice_address_zipcode,
  //   WF.hours
  // FROM
  //     "EMPLOYEE" AS E
  //     JOIN "WORKS_FOR" AS WF ON E.employee_id = WF.employee_id
  //     JOIN "POSTOFFICE_LOCATION" AS PL ON WF.postoffice_location_id = PL.postoffice_location_id
  //     LEFT JOIN "EMPLOYEE" AS M ON E.manager_id = M.employee_id
  // WHERE
  //     E.employee_id = $1
  // ORDER BY
  //     E.employee_id;`,
  //   ["c0cb263c-8e18-4ba5-85ce-70b5451b9f37"]
  // );
  // console.log(testinggg.rows);
};

createAdmin();
// const x = {
//   employee_id: "c0cb263c-8e18-4ba5-85ce-70b5451b9f37",
//   user_id: null,
//   email: "fuck@fuck.com",
//   firstname: "fuck",
//   lastname: "fuck",
//   birthdate: new Date("1121-01-01T05:50:36.000Z"),
//   role: 1,
//   salary: 10200,
//   manager_id: null,
//   manager_lastname: null,

//   address_street: "kaljsdf",
//   address_city: "laksjfd",
//   address_state: "alskjfd",
//   address_zipcode: 1283,

//   startdate: new Date("2023-01-26T06:00:00.000Z"),
//   createAt: new Date("2023-04-03T06:23:22.681Z"),
//   createdBy: "0eeba770-7b60-4e87-95f3-869729b1b373",
//   updatedAt: new Date("2023-04-03T06:23:22.681Z"),
//   updatedBy: "0eeba770-7b60-4e87-95f3-869729b1b373",

//   postoffice_locationname: "money muel",
//   postoffice_address_street: "123 jane st",
//   postoffice_address_city: "fuck",
//   postoffice_address_state: "you",
//   postoffice_address_zipcode: 1234,
//   hours: 0,
// };

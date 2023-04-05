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

  // const getAllPostOfficeLocations = await postgresQuery(
  //   `SELECT P.postoffice_location_id, P.locationname, P.address_street, P.address_city, P.address_state, P.address_zipcode FROM "POSTOFFICE_LOCATION" AS P`,
  //   []
  // );
  // console.log(getAllPostOfficeLocations.rows);
  const getCountOfEmployeesAtEachLocation = await postgresQuery(
    `SELECT postoffice_location_id, COUNT(DISTINCT employee_id) as employee_count
    FROM "WORKS_FOR"
    GROUP BY postoffice_location_id;`,
    []
  );

  console.log(getCountOfEmployeesAtEachLocation.rows);
};

createAdmin();

// CREATE TABLE "POSTOFFICE_LOCATION" (
//   "postoffice_location_id" TEXT NOT NULL, --Pkey
//   "locationname" TEXT NOT NULL,
//   "address_street" TEXT NOT NULL,
//   "address_city" TEXT NOT NULL,
//   "address_state" TEXT NOT NULL,
//   "address_zipcode" INTEGER NOT NULL,
//   "postoffice_location_manager" TEXT,    --uses Fkey

//   "createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
//   "updatedAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

//   CONSTRAINT "POSTOFFICE_LOCATION_PK" PRIMARY KEY ("postoffice_location_id"),
//   CONSTRAINT "POSTOFFICE_LOCATION_MANAGER_FK" FOREIGN KEY ("postoffice_location_manager") REFERENCES "EMPLOYEE"("employee_id") ON DELETE CASCADE ON UPDATE CASCADE
// );

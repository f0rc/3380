// create admin with argon 2 password hased
// create packages, customers

import { hash } from "argon2";
import { randomUUID } from "crypto";
import { postgresQuery } from "./db";

const createAdmin = async () => {
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
  // const getCountOfEmployeesAtEachLocation = await postgresQuery(
  //   `SELECT postoffice_location_id, COUNT(DISTINCT employee_id) as employee_count
  //   FROM "WORKS_FOR"
  //   GROUP BY postoffice_location_id;`,
  //   []
  // );
  // console.log(getCountOfEmployeesAtEachLocation.rows);
  // const dbGetEmployee = await postgresQuery(
  //   // get all the employees that have a lower role than the current user
  //   `SELECT
  //     E.employee_id,
  //     E.firstname,
  //     E.lastname,
  //     E.role,
  //     E.salary,
  //     E.manager_id,
  //     M.lastname AS manager_lastname,
  //     PL.locationname,
  //     PL.address_street,
  //     PL.address_city,
  //     PL.address_state,
  //     PL.address_zipcode,
  //     WF.hours
  //   FROM
  //       "EMPLOYEE" AS E
  //       LEFT JOIN "WORKS_FOR" AS WF ON E.employee_id = WF.employee_id
  //       LEFT JOIN "POSTOFFICE_LOCATION" AS PL ON WF.postoffice_location_id = PL.postoffice_location_id
  //       LEFT JOIN "EMPLOYEE" AS M ON E.manager_id = M.employee_id
  //   ORDER BY
  //       E.employee_id;`,
  //   []
  // );
  // console.log(dbGetEmployee.rows);

  // const getEmployeesBasedOnLocation = await postgresQuery(
  //   // get all the employees that have a works_for at the location of the current user
  //   `SELECT
  //   E.*,
  //   M.lastname AS manager_lastname,
  //   WF.hours
  //   FROM
  //       "EMPLOYEE" AS E
  //       JOIN "WORKS_FOR" AS WF ON E.employee_id = WF.employee_id
  //       JOIN "POSTOFFICE_LOCATION" AS PL ON WF.postoffice_location_id = PL.postoffice_location_id
  //       LEFT JOIN "EMPLOYEE" AS M ON E.manager_id = M.employee_id
  //   WHERE
  //       PL.postoffice_location_id = $1
  //   ORDER BY
  //       E.employee_id;`,
  //   ["433091ef-64b2-4987-acb9-acbabaa8cb5f"]
  // );
  // console.log(getEmployeesBasedOnLocation.rows);
  // const getLocation = await postgresQuery(
  //   `SELECT P.postoffice_location_id, P.locationname, P.address_street, P.address_city, P.address_state, P.address_zipcode, E.firstname as manager_firstname, E.lastname as manager_lastname
  //   FROM "POSTOFFICE_LOCATION" AS P
  //   LEFT JOIN "EMPLOYEE" AS E ON P.postoffice_location_manager = E.employee_id

  //   WHERE P.postoffice_location_id = $1;`,
  //   ["7bd4c430-379f-43e1-8d6d-ce69f5632a46"]
  // );

  // get the location information as well as the employee count at the location
  // const getLocation = await postgresQuery(
  //   `SELECT
  //   P.postoffice_location_id,
  //   P.locationname,
  //   P.address_street,
  //   P.address_city,
  //   P.address_state,
  //   P.address_zipcode,
  //   E.firstname as manager_firstname,
  //   E.lastname as manager_lastname,
  //   COUNT(DISTINCT WF.employee_id) as employee_count
  // FROM
  //   "POSTOFFICE_LOCATION" AS P
  //   LEFT JOIN "EMPLOYEE" AS E ON P.postoffice_location_manager = E.employee_id
  //   LEFT JOIN "WORKS_FOR" AS WF ON P.postoffice_location_id = WF.postoffice_location_id
  // WHERE
  //   P.postoffice_location_id = $1
  // GROUP BY
  //   P.postoffice_location_id,
  //   P.locationname,
  //   P.address_street,
  //   P.address_city,
  //   P.address_state,
  //   P.address_zipcode,
  //   E.firstname,
  //   E.lastname;`,
  //   ["bd1648cc-c15a-4efe-a130-ad6ad3494092"]
  // );

  // console.log(getLocation.rows);

  // const dbGetEmployee = await postgresQuery(
  //   // get all the employees that have a lower role than the current user
  //   `SELECT
  //     E.employee_id,
  //     E.firstname,
  //     E.lastname,
  //     E.role,
  //     E.salary,
  //     E.manager_id,
  //     M.lastname AS manager_lastname,
  //     PL.locationname,
  //     PL.address_street,
  //     PL.address_city,
  //     PL.address_state,
  //     PL.address_zipcode,
  //     WF.hours
  //   FROM
  //       "EMPLOYEE" AS E
  //       LEFT JOIN "WORKS_FOR" AS WF ON E.employee_id = WF.employee_id
  //       LEFT JOIN "POSTOFFICE_LOCATION" AS PL ON WF.postoffice_location_id = PL.postoffice_location_id
  //       LEFT JOIN "EMPLOYEE" AS M ON E.manager_id = M.employee_id
  //   ORDER BY
  //       E.employee_id;`,
  //   []
  // );

  // console.log(dbGetEmployee.rows);

  // const removeManager = await postgresQuery(
  //   `UPDATE "POSTOFFICE_LOCATION" SET "postoffice_location_manager" = NULL WHERE "postoffice_location_id" = $1 RETURNING *;`,
  //   ["661518bf-e987-4141-816d-75b6233e1fa8"]
  // );
  // console.log(removeManager.rows);

  // const packageReport = await postgresQuery(
  //   `SELECT
  //   to_char(P."createdAt", 'YYYY-MM') AS month,
  //   COUNT(P.package_id) AS package_count
  //   FROM "PACKAGE" AS P
  //   WHERE TRUE
  //   AND P."createdAt" >= $1
  //   AND P."createdAt" <= $2
  //   GROUP BY
  //     month
  //   ORDER BY
  //     month;`,
  //   ["2023-01-01", "9999-12-31"]
  // );
  // console.log(packageReport.rows);

  const packageReport = await postgresQuery(
    `SELECT
        to_char(P."createdAt", 'YYYY-MM') AS month,
        COUNT(P.package_id) AS package_count
        FROM "PACKAGE" AS P
        WHERE TRUE AND P."createdAt" >= '$1' AND P."createdAt" <= '$2' GROUP BY
            month
            ORDER BY
            month;`,
    ["2023-01-01", "9999-12-31"]
  );
  console.log(packageReport.rows);
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

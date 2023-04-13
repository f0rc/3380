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
  // const packageReport = await postgresQuery(
  //   `SELECT
  //       to_char(P."createdAt", 'YYYY-MM') AS month,
  //       COUNT(P.package_id) AS package_count
  //       FROM "PACKAGE" AS P
  //       WHERE TRUE AND P."createdAt" >= '$1' AND P."createdAt" <= '$2' GROUP BY
  //           month
  //           ORDER BY
  //           month;`,
  //   ["2023-01-01", "9999-12-31"]
  // );
  // console.log(packageReport.rows);
  // const lole = await postgresQuery(
  //   `WITH "latest_status" AS (
  //     SELECT
  //         "package_id",
  //         MAX("processedAt") AS "latest_processed_at"
  //     FROM "PACKAGE_LOCATION_HISTORY"
  //     GROUP BY "package_id"
  // )
  // SELECT
  //     P."package_id",
  //     P."sender_id",
  //     S."email" AS "sender_email",
  //     P."receiver_id",
  //     R."email" AS "receiver_email",
  //     P."cost",
  //     P."weight",
  //     P."size",
  //     P."type",
  //     PLH."status",
  //     P."createdAt",
  //     to_char(P."createdAt", 'YYYY-MM') AS "month",
  //     COUNT(P."package_id") AS "package_count"
  // FROM "PACKAGE" AS P
  // JOIN "CUSTOMER" AS S ON P."sender_id" = S."customer_id"
  // JOIN "CUSTOMER" AS R ON P."receiver_id" = R."customer_id"
  // JOIN "PACKAGE_LOCATION_HISTORY" AS PLH ON P."package_id" = PLH."package_id"
  // JOIN "latest_status" AS LS ON PLH."package_id" = LS."package_id" AND PLH."processedAt" = LS."latest_processed_at"
  // GROUP BY P."package_id", S."email", R."email", PLH."status"
  // ORDER BY P."package_id" LIMIT 10;
  // `,
  //   []
  // );
  // console.log(lole.rows);
  // const dbGetWorkLog = await postgresQuery(
  //   `INSERT INTO "WORK_LOG" ("employee_id", "hours") VALUES ($1, $2) RETURNING *;`, // daily hours logged
  //   ["2c8873af-be2a-4942-855e-93f2883b98c5", "8"]
  // );
  // console.log(dbGetWorkLog.rows);
  //   const hehehe = await postgresQuery(
  //     `SELECT
  //     employee_id,
  //     date_trunc('week', date) AS week_start_date,
  //     SUM(hours) AS total_hours
  // FROM
  //     "WORK_LOG"
  // WHERE
  //     employee_id = $1
  // GROUP BY
  //     employee_id,
  //     date_trunc('week', date)`,
  //     ["2c8873af-be2a-4942-855e-93f2883b98c5"]
  //   );
  //   console.log(hehehe.rows);
  //   const usls = await postgresQuery(
  //     `WITH weekly_hours AS (
  //       SELECT
  //           employee_id,
  //           date_trunc('week', date) AS week_start_date,
  //           SUM(hours) AS total_hours
  //       FROM
  //           "WORK_LOG"
  //       WHERE
  //           employee_id = $1
  //       GROUP BY
  //           employee_id,
  //           date_trunc('week', date)
  //   )
  //   SELECT
  //       e.firstname,
  //       e.lastname,
  //       wh.week_start_date,
  //       wh.total_hours
  //   FROM
  //       weekly_hours wh
  //   JOIN
  //       "EMPLOYEE" e ON wh.employee_id = e.employee_id
  //   ORDER BY
  //       wh.week_start_date;`,
  //     ["2c8873af-be2a-4942-855e-93f2883b98c5"]
  //   );
  //   console.log(usls.rows);
  //   const dbGetWorkLog = await postgresQuery(
  //     `INSERT INTO "WORK_LOG" (employee_id, hours) VALUES ($1, $2) RETURNING "WORK_LOG".work_log_id;`, // daily hours logged
  //     ["6a147f7d-56b2-4d4c-8192-58921f9a3a5b", 8]
  //   );
  //   console.log(dbGetWorkLog.rows);
  // const checkLocation = await postgresQuery(
  //   `WITH monthly_work_hours AS (
  //     SELECT
  //         employee_id,
  //         EXTRACT(MONTH FROM date) AS month,
  //         EXTRACT(YEAR FROM date) AS year,
  //         SUM(hours) AS total_hours
  //     FROM
  //         "WORK_LOG"
  //         WHERE TRUE AND date >= '$1' AND date <= '$2'
  //     GROUP BY
  //         employee_id, month, year
  //     )
  //     SELECT
  //         wf.employee_id,
  //         mwh.month,
  //         mwh.year,
  //         mwh.total_hours
  //     FROM
  //         "WORKS_FOR" AS wf
  //     JOIN
  //         monthly_work_hours AS mwh
  //     ON
  //         wf.employee_id = mwh.employee_id
  //     WHERE
  //         wf.postoffice_location_id = $1;
  // `,
  //   ["91bb18d8-c3ef-437a-bbe1-f7be7a2a8791"]
  // );
  // console.log(checkLocation.rows);
  //   const employeeCount = await postgresQuery(
  //     `SELECT
  //     "employee_id"
  // FROM
  //     "WORKS_FOR"
  // WHERE
  //     postoffice_location_id = $1;`,
  //     ["91bb18d8-c3ef-437a-bbe1-f7be7a2a8791"]
  //   );
  //   console.log(employeeCount.rows);
  // const workLogQuery = await postgresQuery(
  //   `WITH employee_work_hours AS (
  //     SELECT
  //         wf.postoffice_location_id,
  //         EXTRACT(MONTH FROM wl.date) AS month,
  //         EXTRACT(YEAR FROM wl.date) AS year,
  //         SUM(wl.hours) AS total_hours
  //     FROM
  //         "WORK_LOG" AS wl
  //     JOIN
  //         "WORKS_FOR" AS wf
  //     ON
  //         wl.employee_id = wf.employee_id
  //     WHERE
  //         TRUE AND wl.date >= $1 AND wl.date <= $2
  //         GROUP BY
  //         wf.postoffice_location_id, month, year
  //         )
  //         `,
  //   ["2022-01-01", "2022-12-31", "aff239d9-0633-43a2-a9e6-c32ba5789b6d"]
  // );
  // console.log(workLogQuery.rows);
  // const getLocations = await postgresQuery(
  //   `SELECT DISTINCT w.postoffice_location_id, p.locationname
  //   FROM "WORKS_FOR" w
  //   JOIN "POSTOFFICE_LOCATION" p
  //   ON w.postoffice_location_id = p.postoffice_location_id;`,
  //   []
  // );
  // console.log(getLocations.rows);
  //   const getAllProductsAtLocation = await postgresQuery(
  //     `SELECT
  //   P.product_id,
  //   P.product_name,
  //   P.product_description,
  //   P.price,
  //   P.product_image,
  //   PI.quantity AS available_quantity
  // FROM
  //   "PRODUCT" P
  // JOIN
  //   "PRODUCT_INVENTORY" PI ON P.product_id = PI.product_id
  // WHERE
  //   PI.postoffice_location_id = $1
  // ORDER BY
  //   P.product_name;
  //   `,
  //     ["91bb18d8-c3ef-437a-bbe1-f7be7a2a8791"]
  //   );
  //   console.log(getAllProductsAtLocation.rows);
  // const lowStockProducts = await postgresQuery(
  //   `SELECT
  //       L.alert_id,
  //       L.product_inventory_id,
  //       L.postoffice_location_id,
  //       L.alert_date,
  //       L.is_resolved,
  //       P.product_name
  //     FROM
  //     "LOW_STOCK_ALERTS" L
  //     JOIN "PRODUCT_INVENTORY" PI ON L.product_inventory_id = PI.product_inventory_id
  //     JOIN "PRODUCT" P ON PI.product_id = P.product_id
  //     WHERE
  //     L.postoffice_location_id = $1 AND is_resolved = false
  //     ORDER BY
  //     L.alert_date DESC;
  //     `,
  //   ["33ca229b-6737-4a9d-877b-e00187999343"]
  // );
  // console.log(lowStockProducts.rows);
  // const money = await postgresQuery(
  //   `SELECT p.*, plh.*
  //   FROM "PACKAGE" p
  //   INNER JOIN (
  //   SELECT package_id, MAX("processedAt") AS latest_date
  //   FROM "PACKAGE_LOCATION_HISTORY"
  //   GROUP BY package_id
  //   ) plh2 ON p.package_id = plh2.package_id
  //   INNER JOIN "PACKAGE_LOCATION_HISTORY" plh
  //   ON plh.package_id = plh2.package_id
  //   AND plh."processedAt" = plh2.latest_date
  //   WHERE p."sender_id" IN (
  //     SELECT "customer_id"
  //     FROM "CUSTOMER"
  //     WHERE "user_id" = $1
  // ) OR p."receiver_id" IN (
  //     SELECT "customer_id"
  //     FROM "CUSTOMER"
  //     WHERE "user_id" = $1
  // )
  //   `,
  //   ["ffa19bd7-1e04-49aa-b025-3e7c0185892d"]
  // );
  // console.log(money.rows);
  // const pkgID = randomUUID();
  // const makePackage = await postgresQuery(
  //   `INSERT INTO "PACKAGE" ("package_id", "cost", "sender_id", "receiver_id", "weight", "type", "size", "createdBy", "updatedBy") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
  //   [
  //     pkgID, // package_id
  //     12, // cost
  //     "f2c74d34-ec08-46a9-9dea-ece5b83025dd", // senderID
  //     "f2c74d34-ec08-46a9-9dea-ece5b83025dd", // receiverID
  //     10, // weight
  //     "box", // type
  //     "small", // size
  //     "bca8ca1f-d32c-4324-bd59-c41befa6a651", // employeeID // createdBy
  //     "bca8ca1f-d32c-4324-bd59-c41befa6a651", // employeeID // updatedBy
  //   ]
  // );
  // const makePackageLocationHistory = await postgresQuery(
  //   `INSERT INTO "PACKAGE_LOCATION_HISTORY" ("package_id", "postoffice_location_id", "status",
  //     "processedBy") VALUES ($1, $2, $3, $4)`,
  //   [
  //     pkgID, // package_id
  //     "8fb1ab0d-65fd-4ad0-8ea6-f79b594637e9", // postoffice_location_id // clerk location
  //     "accepted",
  //     "bca8ca1f-d32c-4324-bd59-c41befa6a651", // employeeID // createdBy
  //   ]
  // );
  // console.log(makePackageLocationHistory.rows);
  // const packageDetails = await postgresQuery(
  //   `WITH latest_package_location AS (
  //     SELECT plh.*
  //     FROM "PACKAGE_LOCATION_HISTORY" plh
  //     WHERE plh."package_id" = $1
  //     ORDER BY plh."processedAt" DESC
  //     LIMIT 1
  // )
  // SELECT p.*, lpl.*, pol."locationname"
  // FROM "PACKAGE" p
  // JOIN latest_package_location lpl ON p."package_id" = lpl."package_id"
  // JOIN "POSTOFFICE_LOCATION" pol ON lpl."postoffice_location_id" = pol."postoffice_location_id"
  // WHERE p."package_id" = $1;`,
  //   ["7895cb88-c083-4941-85a9-0d6db68f6903"]
  // );
  // console.log(packageDetails.rows);

  const getAllProductsAtLocation = await postgresQuery(
    `SELECT 
      P.product_id, 
      P.product_name, 
      P.product_description, 
      P.price, 
      P.product_image, 
      PI.quantity AS available_quantity
    FROM 
      "PRODUCT" P
    JOIN 
      "PRODUCT_INVENTORY" PI ON P.product_id = PI.product_id
    WHERE 
      PI.postoffice_location_id = $1
    ORDER BY 
      P.product_name;
      `,
    ["ae1a6005-6715-4fbc-804f-88e624c01c40"]
  );

  console.log(getAllProductsAtLocation.rows);
};

createAdmin();

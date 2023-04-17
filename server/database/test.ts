import { postgresQuery } from "./db";

const createAdmin = async () => {
  const getEmployeeInfo = await postgresQuery(
    `SELECT
    E.employee_id,
    E.firstname,
    E.lastname,
    E.email,
    E.birthdate,
    E.role,
    E.salary,
    E.manager_id,
    E.address_street,
    E.address_city,
    E.address_state,
    E.address_zipcode,
    E.startdate,
    E."createdAt",
    E."createdBy",
    E."updatedAt",
    E."updatedBy",
    PL.locationname AS "work_location",
    SUM(WL.hours) AS "total_hours"
    FROM
        "EMPLOYEE" AS E
    JOIN "WORKS_FOR" AS WF ON E.employee_id = WF.employee_id
    JOIN "POSTOFFICE_LOCATION" AS PL ON WF.postoffice_location_id = PL.postoffice_location_id
    JOIN "WORK_LOG" AS WL ON E.employee_id = WL.employee_id
    GROUP BY
    E.employee_id,
    PL.locationname;`,
    []
  );

  console.log(getEmployeeInfo.rows);
};

createAdmin();

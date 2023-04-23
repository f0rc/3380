import { postgresQuery } from "./db";

const createAdmin = async () => {
  // const getEmployeeInfo = await postgresQuery(``, []);
  // const getOrders = await postgresQuery(
  //   `WITH orders_filtered AS (
  //   SELECT
  //       o.order_id,
  //       o.postoffice_location_id,
  //       o.order_date
  //   FROM
  //       "ORDER" AS o
  //   JOIN
  //       "POSTOFFICE_LOCATION" AS pl
  //   ON
  //       o.postoffice_location_id = pl.postoffice_location_id
  //   WHERE
  //       TRUE AND pl.postoffice_location_id = $1
  //       ) SELECT
  //       of.order_id,
  //       of.postoffice_location_id,
  //       pl.locationname,
  //       pl.address_street,
  //       pl.address_city,
  //       pl.address_state,
  //       pl.address_zipcode,
  //       of.order_date,
  //       oi.product_id,
  //     p.product_name,
  //     oi.quantity,
  //     oi.price
  //     FROM
  //     orders_filtered AS of
  //   JOIN
  //     "POSTOFFICE_LOCATION" AS pl
  //   ON
  //     of.postoffice_location_id = pl.postoffice_location_id
  //   JOIN
  //     "ORDER_ITEMS" AS oi
  //   ON
  //     of.order_id = oi.order_id
  //   JOIN
  //     "PRODUCT" AS p
  //   ON
  //     oi.product_id = p.product_id
  //   ORDER BY
  //     of.order_date;
  //       `,
  //   ["61e57254-20db-4443-90a0-864505c17cbf"]
  // );
  // console.log(getOrders.rows);
  // const orderReport = await postgresQuery(
  //   `WITH monthly_sales AS (
  //     SELECT
  //         oi.product_id,
  //         EXTRACT(MONTH FROM o.order_date) AS month,
  //         EXTRACT(YEAR FROM o.order_date) AS year,
  //         o.postoffice_location_id,
  //         COUNT(DISTINCT o.order_id) AS orders_count,
  //         SUM(oi.quantity) AS total_sold
  //     FROM
  //         "ORDER_ITEMS" AS oi
  //     JOIN
  //         "ORDER" AS o
  //     ON
  //         oi.order_id = o.order_id
  //     JOIN
  //         "POSTOFFICE_LOCATION" AS pl
  //     ON
  //         o.postoffice_location_id = pl.postoffice_location_id
  //     WHERE
  //         TRUE AND pl.postoffice_location_id = $1
  //         GROUP BY
  //             oi.product_id, month, year, o.postoffice_location_id
  //         )
  //         SELECT
  //           ms.product_id,
  //           p.product_name,
  //           ms.month,
  //           ms.year,
  //           ms.postoffice_location_id,
  //           pl.locationname,
  //           pl.address_street,
  //           pl.address_city,
  //           pl.address_state,
  //           pl.address_zipcode,
  //           ms.orders_count,
  //           ms.total_sold
  //         FROM
  //           monthly_sales AS ms
  //         JOIN
  //           "PRODUCT" AS p
  //         ON
  //           ms.product_id = p.product_id
  //         JOIN
  //           "POSTOFFICE_LOCATION" AS pl
  //         ON
  //           ms.postoffice_location_id = pl.postoffice_location_id
  //         ORDER BY
  //           ms.year, ms.month, ms.product_id;
  //     `,
  //   ["a939a17f-3e6f-442d-aa8b-708e44765002"]
  // );
  // console.log(orderReport.rows);
  const dbGetEmployee = await postgresQuery(
    `SELECT
      E.*,
      M.lastname AS manager_lastname,
      PL.postoffice_location_id,
      PL.locationname AS postoffice_locationname,
      PL.address_street AS postoffice_address_street,
      PL.address_city AS postoffice_address_city,
      PL.address_state AS postoffice_address_state,
      PL.address_zipcode AS postoffice_address_zipcode,
      SUM(WL.hours) AS "hours"
  FROM
      "EMPLOYEE" AS E
      LEFT JOIN "WORKS_FOR" AS WF ON E.employee_id = WF.employee_id
      LEFT JOIN "WORK_LOG" AS WL ON E.employee_id = WL.employee_id
      LEFT JOIN "POSTOFFICE_LOCATION" AS PL ON WF.postoffice_location_id = PL.postoffice_location_id
      LEFT JOIN "EMPLOYEE" AS M ON E.manager_id = M.employee_id
  WHERE
      E.employee_id = $1
  GROUP BY
      E.employee_id,
      M.lastname,
      PL.postoffice_location_id,
      PL.locationname,
      PL.address_street,
      PL.address_city,
      PL.address_state,
      PL.address_zipcode;`,
    ["09d15a8b-b118-444c-8c4d-aecb7404c721"]
  );
  console.log(dbGetEmployee.rows[0]);
};

createAdmin();

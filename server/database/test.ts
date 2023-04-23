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
  const orderReport = await postgresQuery(
    `WITH monthly_sales AS (
      SELECT
          oi.product_id,
          EXTRACT(MONTH FROM o.order_date) AS month,
          EXTRACT(YEAR FROM o.order_date) AS year,
          o.postoffice_location_id,
          COUNT(DISTINCT o.order_id) AS orders_count,
          SUM(oi.quantity) AS total_sold,
          SUM(oi.price * oi.quantity) AS total_revenue
      FROM
          "ORDER_ITEMS" AS oi
      JOIN
          "ORDER" AS o
      ON
          oi.order_id = o.order_id
      JOIN
          "POSTOFFICE_LOCATION" AS pl
      ON
          o.postoffice_location_id = pl.postoffice_location_id
      WHERE
          TRUE
          GROUP BY
              oi.product_id, month, year, o.postoffice_location_id
          )
          SELECT
            ms.product_id,
            p.product_name,
            p.price,
            ms.month,
            ms.year,
            ms.postoffice_location_id,
            pl.locationname,
            pl.address_street,
            pl.address_city,
            pl.address_state,
            pl.address_zipcode,
            ms.orders_count,
            ms.total_sold,
            ms.total_revenue
          FROM
            monthly_sales AS ms
          JOIN
            "PRODUCT" AS p
          ON
            ms.product_id = p.product_id
          JOIN
            "POSTOFFICE_LOCATION" AS pl
          ON
            ms.postoffice_location_id = pl.postoffice_location_id
          ORDER BY
            ms.year, ms.month, ms.product_id;
      `,
    []
  );
  console.log(orderReport.rows);
};

createAdmin();

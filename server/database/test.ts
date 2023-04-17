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
    `
      
      `,
    ["61e57254-20db-4443-90a0-864505c17cbf"]
  );

  console.log(orderReport.rows);
};

createAdmin();

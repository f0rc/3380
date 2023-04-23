import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../../utils/trpc";
import { TRPCError } from "@trpc/server";

export const reportRouter = router({
  getPackageReportChart: protectedProcedure
    .input(
      z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        senderID: z.string().optional(),
        receiverID: z.string().optional(),
        employeeID: z.string().optional(),
        postoffice_location_id: z.string().optional(),
        status: z.string().optional(),
        type: z.string().optional(),
        size: z.string().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { postgresQuery } = ctx;
      const {
        startDate,
        endDate,
        senderID,
        receiverID,
        employeeID,
        postoffice_location_id,
        status,
        type,
        size,
      } = input;

      const queryBuilder = (data: typeof input) => {
        const values = [];
        let query = `SELECT
        to_char(P."createdAt", 'YYYY-MM') AS month,
        COUNT(P.package_id) AS package_count
        FROM "PACKAGE" AS P
        WHERE TRUE`;

        let index = 1;

        if (data.startDate) {
          query += ` AND P."createdAt" >= $${index}`;
          values.push(data.startDate);
          index++;
        }
        if (data.endDate) {
          query += ` AND P."createdAt" <= $${index}`;
          values.push(data.endDate);
          index++;
        }
        if (data.senderID) {
          query += ` AND P."sender_id" = $${index}`;
          values.push(data.senderID);
          index++;
        }
        if (data.receiverID) {
          query += ` AND P."receiver_id" = $${index}`;
          values.push(data.receiverID);
          index++;
        }
        if (data.employeeID) {
          query += ` AND P."employee_id" = $${index}`;
          values.push(data.employeeID);
          index++;
        }
        if (data.postoffice_location_id) {
          query += ` AND P."postoffice_location_id" = $${index}`;
          values.push(data.postoffice_location_id);
          index++;
        }
        if (data.status) {
          query += ` AND P."status" = $${index}`;
          values.push(data.status);
          index++;
        }
        if (data.type) {
          query += ` AND P."type" = $${index}`;
          values.push(data.type);
          index++;
        }
        if (data.size) {
          query += ` AND P."size" = $${index}`;
          values.push(data.size);
          index++;
        }

        query += ` GROUP BY
            month
            ORDER BY
            month;`;

        return {
          text: query,
          values,
        };
      };

      const queryBuilder2 = (data: typeof input) => {
        const values = [];
        let query = `WITH "latest_status" AS (
          SELECT
              "package_id",
              MAX("processedAt") AS "latest_processed_at"
          FROM "PACKAGE_LOCATION_HISTORY"
          GROUP BY "package_id"
      )
      SELECT
          P."package_id",
          P."sender_id",
          S."email" AS "sender_email",
          P."receiver_id",
          R."email" AS "receiver_email",
          P."cost",
          P."weight",
          P."size",
          P."type",
          PLH."status",
          P."createdAt"
      FROM "PACKAGE" AS P
      JOIN "CUSTOMER" AS S ON P."sender_id" = S."customer_id"
      JOIN "CUSTOMER" AS R ON P."receiver_id" = R."customer_id"
      JOIN "PACKAGE_LOCATION_HISTORY" AS PLH ON P."package_id" = PLH."package_id"
      JOIN "latest_status" AS LS ON PLH."package_id" = LS."package_id" AND PLH."processedAt" = LS."latest_processed_at"
      WHERE TRUE`;

        let index = 1;

        if (data.startDate) {
          query += ` AND P."createdAt" >= $${index}`;
          values.push(data.startDate);
          index++;
        }
        if (data.endDate) {
          query += ` AND P."createdAt" <= $${index}`;
          values.push(data.endDate);
          index++;
        }
        if (data.senderID) {
          query += ` AND P."sender_id" = $${index}`;
          values.push(data.senderID);
          index++;
        }
        if (data.receiverID) {
          query += ` AND P."receiver_id" = $${index}`;
          values.push(data.receiverID);
          index++;
        }
        if (data.employeeID) {
          query += ` AND P."employee_id" = $${index}`;
          values.push(data.employeeID);
          index++;
        }
        if (data.postoffice_location_id) {
          query += ` AND P."postoffice_location_id" = $${index}`;
          values.push(data.postoffice_location_id);
          index++;
        }
        if (data.status) {
          query += ` AND P."status" = $${index}`;
          values.push(data.status);
          index++;
        }
        if (data.type) {
          query += ` AND P."type" = $${index}`;
          values.push(data.type);
          index++;
        }
        if (data.size) {
          query += ` AND P."size" = $${index}`;
          values.push(data.size);
          index++;
        }

        query += ` GROUP BY P."package_id", S."email", R."email", PLH."status", to_char(P."createdAt", 'YYYY-MM')
        ORDER BY P."package_id"`;

        return {
          text: query,
          values,
        };
      };

      const query1 = queryBuilder({
        startDate,
        endDate,
        senderID,
        receiverID,
        employeeID,
        postoffice_location_id,
        status,
        type,
        size,
      });
      const query2 = queryBuilder2({
        startDate,
        endDate,
        senderID,
        receiverID,
        employeeID,
        postoffice_location_id,
        status,
        type,
        size,
      });

      const packageReportChart = await postgresQuery(
        query1.text,
        query1.values
      );
      const packageReportTable = await postgresQuery(
        query2.text,
        query2.values
      );

      // console.log("LMFAOOO", packageReportTable.rows);

      if (packageReportChart.rows.length === 0) {
        throw new Error("No data found");
      }

      packageReportTable.rows.forEach((item) => {
        const date = new Date(item.createdAt).toLocaleDateString();
        item.createdAt = date;
      });

      return {
        status: "success",
        packageReport: packageReportChart.rows as PackageReportSchema[],
        packageReportTable: packageReportTable.rows as PackageTableData[],
      };
    }),
  getLocationEmployeeReport: protectedProcedure
    .input(
      z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        employeeID: z.array(z.string()).optional(),
        postoffice_location_id: z.string().optional(),
        role: z.number().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { employeeID, endDate, postoffice_location_id, startDate } = input;
      const { postgresQuery } = ctx;

      const queryBuilder = (data: typeof input) => {
        const values = [];
        let query = `
        WITH employee_work_hours AS (
          SELECT
              wf.postoffice_location_id,
              EXTRACT(MONTH FROM wl.date) AS month,
              EXTRACT(YEAR FROM wl.date) AS year,
              SUM(wl.hours) AS total_hours
          FROM
              "WORK_LOG" AS wl
          JOIN
              "WORKS_FOR" AS wf
          ON
              wl.employee_id = wf.employee_id
          WHERE
              TRUE`;

        let index = 1;

        if (data.startDate) {
          query += ` AND wl.date >= $${index}`;
          values.push(data.startDate);
          index++;
        }
        if (data.endDate) {
          query += ` AND wl.date <= $${index}`;
          values.push(data.endDate);
          index++;
        }

        query += `
            GROUP BY
                wf.postoffice_location_id, month, year
        )

        SELECT
          plh.postoffice_location_id,
          plh.locationname,
          plh.address_street,
          plh.address_city,
          plh.address_state,
          plh.address_zipcode,
          ewh.month,
          ewh.year,
          ewh.total_hours
          FROM
          "POSTOFFICE_LOCATION" AS plh
          JOIN
          employee_work_hours AS ewh
          ON
          plh.postoffice_location_id = ewh.postoffice_location_id
          
          WHERE TRUE

          `;

        if (data.postoffice_location_id) {
          query += ` AND ewh.postoffice_location_id = $${index}`;
          values.push(data.postoffice_location_id);
          index++;
        }

        query += ` ORDER BY plh.postoffice_location_id, ewh.month, ewh.year;`;

        return {
          text: query,
          values,
        };
      };

      const query = queryBuilder({
        startDate,
        endDate,
        employeeID,
        postoffice_location_id,
      });

      const employeeHoursReport = await postgresQuery(query.text, query.values);

      if (employeeHoursReport.rows.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No data found",
        });
      }

      return {
        status: "success",
        employeeHoursReport:
          employeeHoursReport.rows as postOfficeLocationReport[],
      };
    }),

  getPackageReport: protectedProcedure
    .input(
      z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        postoffice_location_id: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { endDate, postoffice_location_id, startDate } = input;
      const { postgresQuery } = ctx;

      const queryBuilder = (data: typeof input) => {
        const values = [];
        let index = 1;
        let query = `
        WITH monthly_sales AS (
          SELECT
              oi.product_id,
              EXTRACT(MONTH FROM o.order_date) AS month,
              EXTRACT(YEAR FROM o.order_date) AS year,
              o.postoffice_location_id,
              SUM(oi.quantity) AS total_sold,
              COUNT(DISTINCT o.order_id) AS orders_count
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
              TRUE `;

        if (postoffice_location_id) {
          query += ` AND pl.postoffice_location_id = $1`;
          values.push(postoffice_location_id);
          index++;
        }

        if (startDate) {
          query += ` AND o.order_date >= $${index}`;
          values.push(startDate);
          index++;
        }

        if (endDate) {
          query += ` AND o.order_date <= $${index}`;
          values.push(endDate);
          index++;
        }

        query += `GROUP BY
            oi.product_id, month, year, o.postoffice_location_id
        )
    
        SELECT
          ms.product_id,
          p.product_name,
          ms.month,
          ms.year,
          ms.postoffice_location_id,
          pl.locationname,
          pl.address_street,
          pl.address_city,
          pl.address_state,
          pl.address_zipcode,
          ms.total_sold,
          ms.orders_count
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
          ms.year, ms.month, ms.product_id;`;

        return {
          text: query,
          values,
        };
      };

      const report = await postgresQuery(
        queryBuilder({ startDate, endDate, postoffice_location_id }).text,
        queryBuilder({ startDate, endDate, postoffice_location_id }).values
      );

      console.log(report.rows);

      return {
        status: "success",
        report: report.rows as PackageReportSchema[],
      };
    }),

  getProductReport: protectedProcedure
    .input(
      z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        postoffice_location_id: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const queryBuilder = (data: typeof input) => {
        const values = [];
        let index = 1;

        let query = `
          WITH monthly_sales AS (
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
                TRUE`;

        if (data.postoffice_location_id) {
          query += ` AND pl.postoffice_location_id = $${index}`;
          values.push(data.postoffice_location_id);
          index++;
        }

        if (data.startDate) {
          query += ` AND o.order_date >= $${index}`;
          values.push(data.startDate);
          index++;
        }

        if (data.endDate) {
          query += ` AND o.order_date <= $${index}`;
          values.push(data.endDate);
          index++;
        }

        query += `
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
          `;

        return {
          text: query,
          values,
        };
      };

      const { postgresQuery } = ctx;

      const report = await postgresQuery(
        queryBuilder({ ...input }).text,
        queryBuilder({ ...input }).values
      );

      return {
        status: "success",
        report: report.rows as ProductReportSchema[],
      };
    }),
});

export interface postOfficeLocationReport {
  postoffice_location_id: string;
  locationname: string;
  address_street: string;
  address_city: string;
  address_state: string;
  address_zipcode: number;
  month: string;
  year: string;
  total_hours: string;
}

export type PackageReportSchema = {
  month: string;
  package_count: number;
};

export type PackageTableData = {
  package_id: string;
  sender_id: string;
  sender_email: string;
  receiver_id: string;
  receiver_email: string;
  cost: number;
  weight: number;
  size: string;
  type: string;
  status: string;
  createdat: string;
  subRows?: PackageTableData[];
};

export type ProductReportSchema = {
  product_id: string;
  product_name: string;
  price: string;
  month: string;
  year: string;
  postoffice_location_id: string;
  locationname: string;
  address_street: string;
  address_city: string;
  address_state: string;
  address_zipcode: number;
  orders_count: string;
  total_sold: string;
  total_revenue: string;
};

// {
//   product_id: '8961bb74-2047-45ba-aba7-5d9e057be0ec',
//   product_name: 'money',
//   price: '20.00',
//   month: '4',
//   year: '2023',
//   postoffice_location_id: 'd6976302-7092-4804-8b08-127f0a320002',
//   locationname: 'Geo Palace',
//   address_street: '72820 Jaime Loaf',
//   address_city: 'Wuckertborough',
//   address_state: 'TX',
//   address_zipcode: 84703,
//   orders_count: '3',
//   total_sold: '18',
//   total_revenue: '360.00'
// }

import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../../utils/trpc";

export const reportRouter = router({
  getPackageReportChart: publicProcedure
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

      console.log("LMFAOOO", packageReportTable.rows);

      if (packageReportChart.rows.length === 0) {
        throw new Error("No data found");
      }

      return {
        status: "success",
        packageReport: packageReportChart.rows as PackageReportSchema[],
        packageReportTable: packageReportTable.rows as PackageTableData[],
      };
    }),
  getEmployeeHoursReportPerLocation: publicProcedure
    .input(
      z.object({
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        employeeID: z.array(z.string()).optional(),
        postoffice_location_id: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const { employeeID, endDate, postoffice_location_id, startDate } = input;

      const queryBuilder = (data: typeof input) => {
        const values = [];
        let query = `SELECT
          to_char("createdAt", 'YYYY-MM') AS "month",
          SUM("hours") AS "hours"
      FROM "WORKS_FOR" wf
      WHERE wf.postoffice_location_id = $1`;
        values.push(postoffice_location_id);

        let index = 2;

        if (data.startDate) {
          query += ` AND "createdAt" >= $${index}`;
          values.push(data.startDate);
          index++;
        }
        if (data.endDate) {
          query += ` AND "createdAt" <= $${index}`;
          values.push(data.endDate);
          index++;
        }

        if (data.postoffice_location_id) {
          query += ` AND "postoffice_location_id" = $${index}`;
          values.push(data.postoffice_location_id);
          index++;
        }

        if (data.employeeID) {
          data.employeeID.forEach((id) => {
            query += ` AND "employee_id" = $${index}`;
            values.push(id);
            index++;
          });
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
    }),
});

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
  createdat: Date;
  subRows?: PackageTableData[];
};

// {
//   package_id: '018e5e2b-4439-4f82-b016-27710fb9be42',
//   sender_id: 'df2b3709-7fb7-4c95-a4a6-59bed3f81775',
//   sender_email: 'Ardella_Conroy@gmail.com',
//   receiver_id: 'fb017dfb-7bcc-4664-ac48-36701f3723d2',
//   receiver_email: 'Lowell.Fritsch@gmail.com',
//   cost: '1093',
//   weight: '19.01',
//   size: 'large',
//   type: 'envelope',
//   status: 'accepted',
//   createdAt: 2022-12-12T06:00:00.000Z
// }

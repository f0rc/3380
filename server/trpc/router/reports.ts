import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../../utils/trpc";

export const reportRouter = router({
  getPackageReport: publicProcedure
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

      const { values, text } = queryBuilder({
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
      console.log("input", values);
      console.log("text", text);

      const packageReport = await postgresQuery(text, values);

      console.log(packageReport.rows);

      if (packageReport.rows.length === 0) {
        throw new Error("No data found");
      }

      return {
        status: "success",
        packageReport: packageReport.rows as PackageReportSchema[],
      };
    }),
});

export type PackageReportSchema = {
  month: string;
  package_count: number;
};

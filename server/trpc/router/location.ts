import { randomUUID } from "crypto";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../../utils/trpc";

export const postOfficeLocationSchema = z.object({
  locationname: z.string(),
  address_street: z.string(),
  address_city: z.string(),
  address_state: z.string(),
  address_zipcode: z.number(),
});

export type postOfficeLocationSchemaType = z.infer<
  typeof postOfficeLocationSchema
>;

export const locationRouter = router({
  create: protectedProcedure
    .input(postOfficeLocationSchema)
    .mutation(async ({ input, ctx }) => {
      const {
        locationname,
        address_street,
        address_city,
        address_state,
        address_zipcode,
      } = input;
      const { postgresQuery } = ctx;

      const location = await postgresQuery(
        `INSERT INTO "POSTOFFICE_LOCATION" (
          "postoffice_location_id", 
          "locationname", 
          "address_street", 
          "address_city", 
          "address_state", 
          "address_zipcode"
          ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
        [
          randomUUID(),
          locationname,
          address_street,
          address_city,
          address_state,
          address_zipcode,
        ]
      );

      return {
        status: "success",
        data: location.rows[0],
      };
    }),

  getAllOfficeLocations: protectedProcedure.query(async ({ ctx }) => {
    const { postgresQuery } = ctx;

    const getLocations = await postgresQuery(
      `SELECT P.postoffice_location_id, P.locationname, P.address_street, P.address_city, P.address_state, P.address_zipcode, E.firstname as manager_firstname, E.lastname as manager_lastname
      FROM "POSTOFFICE_LOCATION" AS P
      LEFT JOIN "EMPLOYEE" AS E ON P.postoffice_location_manager = E.employee_id;`,
      []
    );

    const getCountOfEmployeesAtEachLocation = await postgresQuery(
      `SELECT postoffice_location_id, COUNT(DISTINCT employee_id) as employee_count
      FROM "WORKS_FOR"
      GROUP BY postoffice_location_id;`,
      []
    );

    const employeeCountsByLocation =
      getCountOfEmployeesAtEachLocation.rows.reduce((acc, row) => {
        acc[row.postoffice_location_id] = row.employee_count;
        return acc;
      }, {} as Record<string, number>);

    const locationsWithEmployeeCount = getLocations.rows.map((location) => ({
      ...location,
      employee_count:
        employeeCountsByLocation[location.postoffice_location_id] || 0,
    })) as getAllOfficeLocations[];

    return {
      status: "success",
      locations: locationsWithEmployeeCount,
    };
  }),

  setManager: protectedProcedure
    .input(z.object({ manager_id: z.string(), location_id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { postgresQuery } = ctx;
      const { manager_id, location_id } = input;

      const setManager = await postgresQuery(
        `UPDATE "POSTOFFICE_LOCATION" SET "postoffice_location_manager" = $1 WHERE "postoffice_location_id" = $2 RETURNING *;`,
        [manager_id, location_id]
      );
      const updateManager = await postgresQuery(
        `UPDATE "WORKS_FOR" SET "postoffice_location_id" = $1 WHERE "employee_id" = $2 RETURNING *;`,
        [location_id, manager_id]
      );

      const getManager = await postgresQuery(
        `SELECT E.firstname as manager_firstname, E.lastname as manager_lastname
        FROM "EMPLOYEE" AS E
        WHERE E.employee_id = $1;`,
        [manager_id]
      );

      if (getManager.rows.length === 0) {
        return {
          status: "fail",
          message: "No manager found with that ID",
        };
      }

      return {
        status: "success",
        office: {
          ...setManager.rows[0],
          manager_firstname: getManager.rows[0].manager_firstname,
          manager_lastname: getManager.rows[0].manager_lastname,
        } as getAllOfficeLocations,
      };
    }),
});

export interface getAllOfficeLocations {
  postoffice_location_id: string;
  locationname: string;
  address_street: string;
  address_city: string;
  address_state: string;
  address_zipcode: number;
  employee_count: number;
  manager_lastname: string | "No manager assigned";
  manager_firstname: string | "No manager assigned";
}

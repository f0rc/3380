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

export const UpdatepostOfficeLocationSchema = z.object({
  postoffice_location_id: z.string(),
  locationname: z.string(),
  address_street: z.string(),
  address_city: z.string(),
  address_state: z.string(),
  address_zipcode: z.number(),
  postoffice_location_manager: z.string(),
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

  getAllOfficeLocations: publicProcedure.query(async ({ ctx }) => {
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
    .input(
      z.object({ manager_id: z.string(), postoffice_location_id: z.string() })
    )
    .mutation(async ({ input, ctx }) => {
      const { postgresQuery } = ctx;
      const { manager_id, postoffice_location_id } = input;

      // check if a manager was assigned to a location before and remove his manager id from the postofficelocation
      const getPreviousManager = await postgresQuery(
        `SELECT "postoffice_location_id" FROM "POSTOFFICE_LOCATION" WHERE "postoffice_location_manager" = $1;`,
        [manager_id]
      );

      if (getPreviousManager.rows.length !== 0) {
        // console.log("previous manager found");
        const removeManager = await postgresQuery(
          `UPDATE "POSTOFFICE_LOCATION" SET "postoffice_location_manager" = NULL WHERE "postoffice_location_id" = $1 RETURNING *;`,
          [getPreviousManager.rows[0].postoffice_location_id]
        );
      }

      const setManager = await postgresQuery(
        `UPDATE "POSTOFFICE_LOCATION" SET "postoffice_location_manager" = $1 WHERE "postoffice_location_id" = $2 RETURNING *;`,
        [manager_id, postoffice_location_id]
      );
      const updateManager = await postgresQuery(
        `UPDATE "WORKS_FOR" SET "postoffice_location_id" = $2 WHERE "employee_id" = $1 RETURNING *;`,
        [manager_id, postoffice_location_id]
      );

      if (updateManager.rows.length === 0 || setManager.rows.length === 0) {
        return {
          status: "fail",
          message: "Something went wrong",
        };
      }

      return {
        status: "success",
      };
    }),

  updateLocation: protectedProcedure
    .input(UpdatepostOfficeLocationSchema)
    .mutation(async ({ input, ctx }) => {
      const { postgresQuery } = ctx;
      const {
        postoffice_location_id,
        locationname,
        address_street,
        address_city,
        address_state,
        address_zipcode,
        postoffice_location_manager,
      } = input;

      const updateLocation = await postgresQuery(
        `UPDATE "POSTOFFICE_LOCATION" SET "locationname" = $1, "address_street" = $2, "address_city" = $3, "address_state" = $4, "address_zipcode" = $5, "postoffice_location_manager" = $6 WHERE "postoffice_location_id" = $7 RETURNING *;`,
        [
          locationname,
          address_street,
          address_city,
          address_state,
          address_zipcode,
          postoffice_location_manager,
          postoffice_location_id,
        ]
      );

      if (updateLocation.rows.length === 0) {
        return {
          status: "fail",
          message: "No location found with that ID",
        };
      }

      return {
        status: "success",
      };
    }),

  hireEmployee: protectedProcedure
    .input(z.object({ employee_id: z.string(), location_id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { postgresQuery } = ctx;
      const { employee_id, location_id } = input;

      const hireEmployee = await postgresQuery(
        `UPDATE "WORKS_FOR" SET "postoffice_location_id" = $1 WHERE "employee_id" = $2 RETURNING *;`,
        [location_id, employee_id]
      );

      if (hireEmployee.rows.length === 0) {
        return {
          status: "fail",
          message: "No employee found with that ID",
        };
      }

      return {
        status: "success",
        employee: hireEmployee.rows[0],
      };
    }),

  getLocationDetails: protectedProcedure
    .input(z.object({ postoffice_location_id: z.string() }))
    .query(async ({ input, ctx }) => {
      const { postgresQuery } = ctx;
      const { postoffice_location_id } = input;

      const getLocation = await postgresQuery(
        `SELECT
        P.postoffice_location_id,
        P.locationname,
        P.address_street,
        P.address_city,
        P.address_state,
        P.address_zipcode,
        E.firstname as manager_firstname,
        E.lastname as manager_lastname,
        COUNT(DISTINCT WF.employee_id) as employee_count
      FROM
        "POSTOFFICE_LOCATION" AS P
        LEFT JOIN "EMPLOYEE" AS E ON P.postoffice_location_manager = E.employee_id
        LEFT JOIN "WORKS_FOR" AS WF ON P.postoffice_location_id = WF.postoffice_location_id
      WHERE
        P.postoffice_location_id = $1
      GROUP BY
        P.postoffice_location_id,
        P.locationname,
        P.address_street,
        P.address_city,
        P.address_state,
        P.address_zipcode,
        E.firstname,
        E.lastname;`,
        [postoffice_location_id]
      );

      if (getLocation.rows.length === 0) {
        return {
          status: "fail",
          message: "No location found with that ID",
        };
      }

      return {
        status: "success",
        location: getLocation.rows[0] as getAllOfficeLocations,
      };
    }),

  getOffliceLocationNameID: publicProcedure.query(async ({ ctx }) => {
    const { postgresQuery } = ctx;

    const getLocationNameID = await postgresQuery(
      `SELECT "postoffice_location_id", "locationname" FROM "POSTOFFICE_LOCATION";`,
      []
    );

    if (getLocationNameID.rows.length === 0) {
      return {
        status: "fail",
        message: "No locations found",
      };
    }

    return {
      status: "success",
      locations: getLocationNameID.rows as getAllOfficeLocationsNameID[],
    };
  }),

  getOfficeLocationsFromWorksFor: publicProcedure.query(
    async ({ input, ctx }) => {
      const { postgresQuery } = ctx;

      const getLocations = await postgresQuery(
        `SELECT DISTINCT w.postoffice_location_id, p.locationname
        FROM "WORKS_FOR" w
        JOIN "POSTOFFICE_LOCATION" p
        ON w.postoffice_location_id = p.postoffice_location_id;`,
        []
      );

      if (getLocations.rows.length === 0) {
        return {
          status: "fail",
          message: "No locations found",
        };
      }

      return {
        status: "success",
        locations: getLocations.rows as getAllOfficeLocationsNameID[],
      };
    }
  ),
});

// create a partial type of the getAllOfficeLocations interface to only include offline_location_id and locationname
export type getAllOfficeLocationsNameID = Pick<
  getAllOfficeLocations,
  "postoffice_location_id" | "locationname"
>;

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

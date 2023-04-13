import { TRPCError } from "@trpc/server";
import { randomUUID } from "crypto";
import { z } from "zod";
import { createPackageFormSchema } from "../../utils/packageSchema";

import { protectedProcedure, publicProcedure, router } from "../../utils/trpc";

export const packageRouter = router({
  createPackage: protectedProcedure
    .input(createPackageFormSchema)
    .mutation(async ({ ctx, input }) => {
      const { postgresQuery } = ctx;
      const { steps } = input;

      //get clerk location
      const clerkLocation = await postgresQuery(
        `SELECT "postoffice_location_id" FROM "WORKS_FOR" WHERE "employee_id" = $1`,
        [ctx.session.user.employee_id]
      );
      // console.log("clerkLocation", clerkLocation.rows[0]);
      if (
        clerkLocation.rowCount === 0 ||
        clerkLocation.rows[0].postoffice_location_id === null
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Clerk is not assigned to a location",
        });
      }

      const getSender = async () => {
        try {
          const getSenderID = await postgresQuery(
            `select "CUSTOMER"."customer_id" AS senderID FROM "CUSTOMER" where "email" = $1`,
            [steps.senderInfo.value.email]
          );

          if (getSenderID.rowCount === 0 || !getSenderID) {
            const senderID = await postgresQuery(
              `INSERT INTO "CUSTOMER" ("customer_id", "firstname", "lastname", "email", "phoneNumber", "address_street", "address_city", "address_state", "address_zipcode", "createdBy", "updatedBy") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING "customer_id" as senderID`,
              [
                randomUUID(), //##TODO: make this a uuid in the db automatically /1
                steps.senderInfo.value.firstName, //2
                steps.senderInfo.value.lastName, //3
                steps.senderInfo.value.email, //4
                steps.senderInfo.value.phone, //5
                steps.senderInfo.value.address, //6
                steps.senderInfo.value.city, //7
                steps.senderInfo.value.state, //8
                steps.senderInfo.value.zip, //9
                ctx.session.user.id, // employeeID /10
                ctx.session.user.id, // employeeID /11
              ]
            );
            return senderID.rows[0].senderid as string;
          }
          return getSenderID.rows[0].senderid as string;
        } catch (e) {
          console.log("error", e);
        }
      };

      const getReciver = async () => {
        const getReceiverID = await postgresQuery(
          `select "CUSTOMER"."customer_id" AS receiverid FROM "CUSTOMER" where "email" = $1`,
          [steps.receiverInfo.value.email]
        );

        if (getReceiverID.rowCount === 0 || !getReceiverID) {
          const receiverID = await postgresQuery(
            `INSERT INTO "CUSTOMER" ("customer_id", "firstname", "lastname", "email", "phoneNumber", "address_street", "address_city", "address_state", "address_zipcode", "createdBy", "updatedBy") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING "customer_id" as receiverid`,
            [
              randomUUID(), //##TODO: make this a uuid in the db automatically
              steps.receiverInfo.value.firstName,
              steps.receiverInfo.value.lastName,
              steps.receiverInfo.value.email,
              steps.receiverInfo.value.phone,
              steps.receiverInfo.value.address,
              steps.receiverInfo.value.city,
              steps.receiverInfo.value.state,
              steps.receiverInfo.value.zip,
              ctx.session.user.id, // employeeID
              ctx.session.user.id, // employeeID
            ]
          );
          return receiverID.rows[0].receiverid as string;
        } else {
          return getReceiverID.rows[0].receiverid as string;
        }
      };

      const senderID = await getSender();
      const receiverID = await getReciver();

      const package_ID = randomUUID();

      const makePackage = await postgresQuery(
        `INSERT INTO "PACKAGE" ("package_id", "cost", "sender_id", "receiver_id", "weight", "type", "size", "createdBy", "updatedBy") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [
          package_ID, // package_id // cost
          steps.packageInfo.value.price,
          senderID, // senderID
          receiverID, // receiverID
          steps.packageInfo.value.packageWeight, // weight
          steps.packageInfo.value.packageType, // type
          steps.packageInfo.value.packageSize, // size
          ctx.session.user.id, // employeeID // createdBy
          ctx.session.user.id, // employeeID // updatedBy
        ]
      );

      if (makePackage.rowCount === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Could not create package",
        });
      }

      // make package location history

      const makePackageLocationHistory = await postgresQuery(
        `INSERT INTO "PACKAGE_LOCATION_HISTORY" ("package_id", "postoffice_location_id", "status", 
        "processedBy") VALUES ($1, $2, $3, $4) RETURNING *`,
        [
          package_ID, // package_id
          clerkLocation.rows[0].postoffice_location_id, // postoffice_location_id // clerk location
          "accepted",
          ctx.session.user.employee_id, // employeeID // createdBy
        ]
      );

      if (makePackageLocationHistory.rowCount === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Could not create package location history",
        });
      }

      return {
        status: "success",
        package: makePackage.rows[0] as PackageSchema,
      };
    }),

  packageList: protectedProcedure.query(async ({ ctx }) => {
    const { postgresQuery } = ctx;

    const packageList = await postgresQuery(
      `
      SELECT p.*, plh.*
      FROM "PACKAGE" p
      INNER JOIN (
      SELECT package_id, MAX("processedAt") AS latest_date
      FROM "PACKAGE_LOCATION_HISTORY"
      GROUP BY package_id
      ) plh2 ON p.package_id = plh2.package_id

      INNER JOIN "PACKAGE_LOCATION_HISTORY" plh
      ON plh.package_id = plh2.package_id
      AND plh."processedAt" = plh2.latest_date

      WHERE p."sender_id" IN (
        SELECT "customer_id"
        FROM "CUSTOMER"
        WHERE "user_id" = $1
    ) OR p."receiver_id" IN (
        SELECT "customer_id"
        FROM "CUSTOMER"
        WHERE "user_id" = $1
    );
      `,
      [ctx.session.user.id]
    );

    // console.log("packageList", packageList.rows);

    return {
      status: "success",
      packageList: packageList.rows as PackageSchemaWithStatus[],
    };
  }),

  packageDetailsPublic: publicProcedure
    .input(z.object({ package_id: z.string() }))
    .query(async ({ ctx, input }) => {
      // console.log("PACKAGE ID", input.package_id);
      const { postgresQuery } = ctx;
      const { package_id } = input;

      const packageDetails = await postgresQuery(
        `WITH latest_package_location AS (
          SELECT plh.*
          FROM "PACKAGE_LOCATION_HISTORY" plh
          WHERE plh."package_id" = $1
          ORDER BY plh."processedAt" DESC
          LIMIT 1
      )
      SELECT p.*, lpl.*, pol."locationname"
      FROM "PACKAGE" p
      JOIN latest_package_location lpl ON p."package_id" = lpl."package_id"
      JOIN "POSTOFFICE_LOCATION" pol ON lpl."postoffice_location_id" = pol."postoffice_location_id"
      WHERE p."package_id" = $1;`,
        [package_id]
      );

      // console.log("HEEEEERREE", packageDetails.rows[0].status);

      if (packageDetails.rowCount === 0) {
        return {
          status: "error",
          code: 404,
          message: "Package not found",
        };
      }
      return {
        status: "success",
        code: 200,
        packageDetails: packageDetails
          .rows[0] as packageWithStatusDetailAddress,
      };
    }),

  packageDetails: protectedProcedure
    .input(z.object({ package_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { postgresQuery } = ctx;
      const { package_id } = input;

      const packageDetails = await postgresQuery(
        `SELECT plh.*, pol.*
        FROM "PACKAGE_LOCATION_HISTORY" AS plh
        JOIN "POSTOFFICE_LOCATION" AS pol ON plh.postoffice_location_id = pol.postoffice_location_id
        WHERE package_id = $1
        ORDER BY plh."processedAt" DESC;`,
        [package_id]
      );

      if (packageDetails.rowCount === 0) {
        return {
          status: "error",
          code: 404,
          message: "Package not found",
        };
      }
      return {
        status: "success",
        code: 200,
        packageHistory: packageDetails.rows as packageHistory[],
      };
    }),
});

export interface PackageSchema {
  package_id: string;
  sender_id: string;
  receiver_id: string;
  cost: number;
  weight: number;
  type: string;
  size: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PackageSchemaWithStatus extends PackageSchema {
  package_location_id: number;
  location_id: string;
  intransitcounter: number;
  status: string;
  processedAt: string;
}
// {
//   package_location_id: 1,
//   package_id: '3712942b-d18b-4b0c-9d8a-74944e2d569f',
//   postoffice_location_id: '9',
//   intransitcounter: 0,
//   status: 'accepted',
//   processedAt: 2023-04-13T07:31:46.186Z,
//   processedBy: '6cdf04bc-34d7-410b-b853-71672663d620',
//   locationname: 'fuck off',
//   address_street: '12308',
//   address_city: 'laskjf',
//   address_state: 'laksjf',
//   address_zipcode: 1203978,
//   postoffice_location_manager: 'cf505e9e-c56b-4b4e-9425-a09cb452c43f',
//   createdAt: 2023-04-13T05:00:00.000Z,
//   updatedAt: 2023-04-13T05:00:00.000Z
// }
// make a interface
export interface packageHistory {
  package_location_id: number;
  package_id: string;
  postoffice_location_id: string;
  intransitcounter: number;
  status: string;
  processedAt: string;
  processedBy: string;
  locationname: string;
  address_street: string;
  address_city: string;
  address_state: string;
  address_zipcode: number;
  postoffice_location_manager: string;
  createdAt: string;
  updatedAt: string;
}

export interface packageWithStatusDetailAddress {
  package_id: string;
  sender_id: string;
  receiver_id: string;
  cost: string;
  weight: string;
  type: string;
  size: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  package_location_id: number;
  postoffice_location_id: string;
  intransitcounter: number;
  status: string;
  processedAt: string;
  processedBy: string;
  locationname: string;
  address_street: string;
  address_city: string;
  address_state: string;
  address_zipcode: number;
  postoffice_location_manager: string;
}

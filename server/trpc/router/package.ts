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
      console.log("clerkLocation", clerkLocation.rows[0]);
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
          package_ID, // package_id
          0, // cost
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

    console.log("packageList", packageList.rows);

    return {
      status: "success",
      packageList: packageList.rows as PackageSchemaWithStatus[],
    };
  }),

  packageDetailsPublic: publicProcedure
    .input(z.object({ package_id: z.string() }))
    .query(async ({ ctx, input }) => {
      console.log("PACKAGE ID", input.package_id);
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
      SELECT p.*, lpl.*
      FROM "PACKAGE" p
      JOIN latest_package_location lpl ON p."package_id" = lpl."package_id"
      WHERE p."package_id" = $1;`,
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
        packageDetails: packageDetails.rows[0] as PackageSchema,
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
//example output
// {
//   package_id: '21c57f4f-2c83-4d77-a7a4-39364a88abb4',
//   sender_id: '116e3c4c-d5f3-494d-9531-2f5ba142d068',
//   receiver_id: '5faba5e1-6066-4bad-ab6d-175079fdc26e',
//   cost: '0',
//   weight: '182',
//   type: 'box',
//   size: 'extra large',
//   createdAt: 2023-03-19T10:21:41.560Z,
//   createdBy: '6fa0e11c-adef-4f74-85df-a0dfa31b43d6',
//   updatedAt: 2023-03-19T05:00:00.000Z,
//   updatedBy: '6fa0e11c-adef-4f74-85df-a0dfa31b43d6',
//   package_location_id: 19,
//   location_id: '80202',
//   intransitcounter: 3,
//   status: 'fail'
// }

// CREATE TABLE "PACKAGE_LOCATION_HISTORY" (
//   "package_location_id" SERIAL NOT NULL,
//   "package_id" TEXT NOT NULL, --refer to Package
//   "postoffice_location_id" TEXT NOT NULL,
//   "intransitcounter" INTEGER NOT NULL DEFAULT 0,
//   -- make a status
//   "status" TEXT NOT NULL CHECK ("status" IN('accepted', 'transit', 'delivered','out-for-delivery', 'fail')),
//   "processedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
//   "processedBy" TEXT NOT NULL, --employee ID

//   CONSTRAINT "package_location_id" PRIMARY KEY ("package_location_id")
// );

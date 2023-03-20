import { TRPCError } from "@trpc/server";
import { randomUUID } from "crypto";
import { createPackageFormSchema } from "src/frontend/pages/create_package/formSchema";
import { z } from "zod";

import { protectedProcedure, publicProcedure, router } from "../utils/trpc";

export const packageRouter = router({
  createPackage: protectedProcedure
    .input(createPackageFormSchema)
    .mutation(async ({ ctx, input }) => {
      const { postgresQuery } = ctx;
      const { steps } = input;
      console.log("SESSION ID", ctx.session.user);

      console.log(steps.senderInfo.value.email);
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
          package_ID,
          0, //##TODO: make this real cost
          senderID,
          receiverID,
          steps.packageInfo.value.packageWeight,
          steps.packageInfo.value.packageType,
          steps.packageInfo.value.packageSize,
          ctx.session.user.id, // employeeID
          ctx.session.user.id, // employeeID
        ]
      );

      return {
        status: "success",
        package: makePackage.rows[0] as PackageSchema,
      };
    }),

  packageList: protectedProcedure.query(async ({ ctx }) => {
    const { postgresQuery } = ctx;

    const packageList = await postgresQuery(
      `SELECT p.*, plh.*
      FROM "PACKAGE" p
      INNER JOIN (
          SELECT package_id, MAX("processedAt") AS latest_date
          FROM "PACKAGE_LOCATION_HISTORY"
          GROUP BY package_id
      ) plh2 ON p.package_id = plh2.package_id
      INNER JOIN "PACKAGE_LOCATION_HISTORY" plh
          ON plh.package_id = plh2.package_id
          AND plh."processedAt" = plh2.latest_date`,
      []
    );
    console.log(packageList.rows);

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
        `SELECT "PACKAGE"."package_id", "type", "size", "weight", "status", "location_id" FROM "PACKAGE", "PACKAGE_LOCATION_HISTORY" WHERE "PACKAGE"."package_id" = $1 AND "PACKAGE"."package_id" = "PACKAGE_LOCATION_HISTORY"."package_id" LIMIT 1`,
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

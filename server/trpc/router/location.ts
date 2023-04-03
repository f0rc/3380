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
});

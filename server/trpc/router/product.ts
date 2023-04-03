import { randomUUID } from "crypto";
import { z } from "zod";
import { postgresQuery } from "../../database/db";
import { protectedProcedure, publicProcedure, router } from "../../utils/trpc";

const MAX_FILE_SIZE = 500000000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
export const createProductSchema = z.object({
  product_name: z.string().min(1).max(255),
  product_description: z.string().optional(),
  price: z.number().min(0),
  quantity: z.number().min(0),
  product_image: z.string().optional(),
});

export type createProductSchemaType = z.infer<typeof createProductSchema>;

export const productRouter = router({
  create: publicProcedure
    .input(createProductSchema)
    .mutation(async ({ input, ctx }) => {
      const {
        product_name,
        product_description,
        price,
        product_image,
        quantity,
      } = input;

      const product = await postgresQuery(
        `INSERT INTO "PRODUCT" ("product_id","product_name", "product_description", "price", "product_image", "createdBy") VALUES ($1, $2, $3, $4, $5, $6) RETURNING "PRODUCT"."product_id"`,
        [
          randomUUID(),
          product_name,
          product_description,
          price,
          product_image,
          ctx.session?.user?.employee_id,
        ]
      );

      // get employee postoffice location
      //TODO ADD A BRANCH VALUE FROM FORM SO THAT MANAGER CAN SELECT WHICH BRANCH TO ADD PRODUCT TO
      const employeePostofficeLocation = await postgresQuery(
        `SELECT "postoffice_location_id" FROM "WORKS_FOR" WHERE "employee_id" = $1`,
        [ctx.session?.user?.employee_id]
      );

      const productInventory = await postgresQuery(
        `INSERT INTO "PRODUCT_INVENTORY" ("product_id", "postoffice_location_id", "quantity") VALUES ($1, $2, $3)`,
        [
          product.rows[0].product_id,
          employeePostofficeLocation.rows[0].postoffice_location_id,
          quantity,
        ]
      );

      return {
        status: "success",
        message: "Product created successfully",
        product: {
          product_id: product.rows[0].product_id,
        },
      };
    }),
});

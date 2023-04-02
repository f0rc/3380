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
      const employeePostofficeLocation = await postgresQuery(
        `SELECT "postoffice_location_id" FROM "EMPLOYEE" WHERE "employee_id" = $1`,
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

// CREATE TABLE "PRODUCT" (
//   "product_id" TEXT NOT NULL,
//   "product_name" VARCHAR(255) NOT NULL,
//   "product_description" TEXT,
//   "price" DECIMAL(10, 2) NOT NULL,
//   "product_image" TEXT NOT NULL,
//   "createdBy" TEXT NOT NULL,
//   "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
//   "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

//   CONSTRAINT "PRODUCT_PK" PRIMARY KEY ("product_id")
// );

// CREATE TABLE "PRODUCT_INVENTORY" (
//   "product_inventory_id" SERIAL NOT NULL,
//   "product_id" TEXT NOT NULL,
//   "postoffice_location_id" TEXT NOT NULL,
//   "quantity" INTEGER NOT NULL DEFAULT 0,
//   "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

//   CONSTRAINT "PRODUCT_INVENTORY_PK" PRIMARY KEY ("product_inventory_id"),
//   CONSTRAINT "PRODUCT_INVENTORY_PRODUCT_FK" FOREIGN KEY ("product_id") REFERENCES "PRODUCT"("product_id") ON DELETE CASCADE ON UPDATE CASCADE,
//   CONSTRAINT "PRODUCT_INVENTORY_LOCATION_FK" FOREIGN KEY ("postoffice_location_id") REFERENCES "POSTOFFICE_LOCATION"("postoffice_location_id") ON DELETE CASCADE ON UPDATE CASCADE
// );

// CREATE TABLE "PRODUCT_TRANSACTION" (
//   "product_transaction_id" SERIAL NOT NULL,
//   "product_id" TEXT NOT NULL,
//   "postoffice_location_id" TEXT NOT NULL,
//   "transaction_type" VARCHAR(20) NOT NULL CHECK ("transaction_type" IN('purchase', 'sale', 'transfer')),
//   "quantity" INTEGER NOT NULL,
//   "transaction_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
//   "createdBy" TEXT NOT NULL,

//   CONSTRAINT "PRODUCT_TRANSACTION_PK" PRIMARY KEY ("product_transaction_id"),
//   CONSTRAINT "PRODUCT_TRANSACTION_PRODUCT_FK" FOREIGN KEY ("product_id") REFERENCES "PRODUCT"("product_id") ON DELETE CASCADE ON UPDATE CASCADE,
//   CONSTRAINT "PRODUCT_TRANSACTION_LOCATION_FK" FOREIGN KEY ("postoffice_location_id") REFERENCES "POSTOFFICE_LOCATION"("postoffice_location_id") ON DELETE CASCADE ON UPDATE CASCADE
// );

// CREATE TABLE "SALES_ORDER" (
// "id" SERIAL PRIMARY KEY,
// "postoffice_location_id" TEXT NOT NULL,
// "customer_id" TEXT NOT NULL,
// "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
// "created_by" TEXT NOT NULL,
// FOREIGN KEY ("postoffice_location_id") REFERENCES "POSTOFFICE_LOCATION"("postoffice_location_id"),
// FOREIGN KEY ("customer_id") REFERENCES "CUSTOMER"("customer_id"),
// FOREIGN KEY ("created_by") REFERENCES "EMPLOYEE"("employee_id")
// );

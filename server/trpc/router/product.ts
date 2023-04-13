import { randomUUID } from "crypto";
import { z } from "zod";
import { postgresQuery } from "../../database/db";
import { protectedProcedure, publicProcedure, router } from "../../utils/trpc";
import { TRPCError } from "@trpc/server";

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

  update: protectedProcedure
    .input(
      z.object({
        product_id: z.string(),
        product_name: z.string().min(1).max(255),
        product_description: z.string().optional(),
        price: z.number().min(0),
        quantity: z.number().min(0),
        product_image: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const {
        product_id,
        product_name,
        product_description,
        price,
        product_image,
        quantity,
      } = input;

      const product = await postgresQuery(
        `UPDATE "PRODUCT" SET "product_name" = $1, "product_description" = $2, "price" = $3, "product_image" = $4 WHERE "product_id" = $5 RETURNING "PRODUCT"."product_id"`,
        [product_name, product_description, price, product_image, product_id]
      );

      // get employee postoffice location
      const employeePostofficeLocation = await postgresQuery(
        `SELECT "postoffice_location_id" FROM "WORKS_FOR" WHERE "employee_id" = $1`,
        [ctx.session?.user?.employee_id]
      );

      const productInventory = await postgresQuery(
        `UPDATE "PRODUCT_INVENTORY" SET "quantity" = $1 WHERE "product_id" = $2 AND "postoffice_location_id" = $3`,
        [
          quantity,
          product_id,
          employeePostofficeLocation.rows[0].postoffice_location_id,
        ]
      );

      return {
        status: "success",
        message: "Product updated successfully",
        product: {
          product_id: product.rows[0].product_id,
        },
      };
    }),

  delete: protectedProcedure
    .input(z.object({ product_id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { product_id } = input;

      const product = await postgresQuery(
        `DELETE FROM "PRODUCT" WHERE "product_id" = $1 RETURNING "PRODUCT"."product_id"`,
        [product_id]
      );

      // get employee postoffice location
      const employeePostofficeLocation = await postgresQuery(
        `SELECT "postoffice_location_id" FROM "WORKS_FOR" WHERE "employee_id" = $1`,
        [ctx.session?.user?.employee_id]
      );

      const productInventory = await postgresQuery(
        `DELETE FROM "PRODUCT_INVENTORY" WHERE "product_id" = $1 AND "postoffice_location_id" = $2`,
        [product_id, employeePostofficeLocation.rows[0].postoffice_location_id]
      );

      return {
        status: "success",
        message: "Product deleted successfully",
        product: {
          product_id: product.rows[0].product_id,
        },
      };
    }),

  getOneProduct: publicProcedure
    .input(
      z.object({ product_id: z.string(), locationId: z.string().optional() })
    )
    .query(async ({ input, ctx }) => {
      const { product_id, locationId } = input;

      const managerLocation = await postgresQuery(
        `SELECT "postoffice_location_id" FROM "WORKS_FOR" WHERE "employee_id" = $1`,
        [ctx.session?.user?.employee_id]
      );

      const product = await postgresQuery(
        `SELECT 
        P.product_id, 
        P.product_name, 
        P.product_description, 
        P.price, 
        P.product_image, 
        PI.quantity AS available_quantity
        FROM 
            "PRODUCT" P
        JOIN 
            "PRODUCT_INVENTORY" PI ON P.product_id = PI.product_id
        WHERE 
            PI.postoffice_location_id = $1 AND
            P.product_id = $2
        LIMIT 1;`,
        [
          locationId ?? managerLocation.rows[0].postoffice_location_id,
          product_id,
        ]
      );

      if (product.rows.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }
      return {
        status: "success",
        product: product.rows[0],
      };
    }),

  getAllProducts: publicProcedure
    .input(
      z.object({
        locationId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const getAllProductsAtLocation = await postgresQuery(
        `SELECT 
          P.product_id, 
          P.product_name, 
          P.product_description, 
          P.price, 
          P.product_image, 
          PI.quantity AS available_quantity
        FROM 
          "PRODUCT" P
        JOIN 
          "PRODUCT_INVENTORY" PI ON P.product_id = PI.product_id
        WHERE 
          PI.postoffice_location_id = $1
        ORDER BY 
          P.product_name;
          `,
        [input.locationId]
      );

      return {
        status: "success",
        products: getAllProductsAtLocation.rows as getProductWithQuantity[],
      };
    }),
  getAllProductsManager: protectedProcedure.query(async ({ input, ctx }) => {
    const getManagerLocation = await postgresQuery(
      `SELECT "postoffice_location_id" FROM "WORKS_FOR" WHERE "employee_id" = $1`,
      [ctx.session?.user?.employee_id]
    );

    const getAllProductsAtLocation = await postgresQuery(
      `SELECT 
          P.product_id, 
          P.product_name, 
          P.product_description, 
          P.price, 
          P.product_image, 
          PI.quantity AS available_quantity
        FROM 
          "PRODUCT" P
        JOIN 
          "PRODUCT_INVENTORY" PI ON P.product_id = PI.product_id
        WHERE 
          PI.postoffice_location_id = $1
        ORDER BY 
          P.product_name;
          `,
      [getManagerLocation.rows[0].postoffice_location_id]
    );

    return {
      status: "success",
      products: getAllProductsAtLocation.rows as getProductWithQuantity[],
    };
  }),

  createOrder: protectedProcedure
    .input(
      z.object({
        products: z.array(
          z.object({
            product_id: z.string(),
            quantity: z.number().min(1),
            price: z.number().min(0),
          })
        ),
        postoffice_location_id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { products, postoffice_location_id } = input;

      const getCustomerId = await postgresQuery(
        `SELECT "customer_id" FROM "CUSTOMER" WHERE "user_id" = $1`,
        [ctx.session?.user?.id]
      );

      const order = await postgresQuery(
        `INSERT INTO "ORDER" ("customer_id", "postoffice_location_id", "total_price") VALUES ($1, $2, $3) RETURNING "ORDER"."order_id"`,
        [
          getCustomerId.rows[0].customer_id,
          postoffice_location_id,
          input.products.reduce(
            (acc, product) => acc + product.quantity * product.price,
            0
          ),
        ]
      );

      const order_id = order.rows[0].order_id;

      const orderProducts = products.map(async (product) => {
        const orderProduct = await postgresQuery(
          `INSERT INTO "ORDER_ITEMS" ("order_id", "product_id", "quantity", "price") VALUES ($1, $2, $3, $4) RETURNING "ORDER_ITEMS"."order_item_id"`,
          [order_id, product.product_id, product.quantity, product.price]
        );
      });

      const updateInventory = products.map(async (product) => {
        const inventory = await postgresQuery(
          `UPDATE "PRODUCT_INVENTORY" SET "quantity" = "quantity" - $1 WHERE "product_id" = $2 AND "postoffice_location_id" = $3`,
          [product.quantity, product.product_id, postoffice_location_id]
        );
      });

      await Promise.all(orderProducts);

      await Promise.all(updateInventory);

      return {
        status: "success",
        message: "Order created successfully",
        order: {
          order_id,
        },
      };
    }),

  lowStockNotification: protectedProcedure.query(async ({ ctx }) => {
    const managerLocation = await postgresQuery(
      `SELECT "postoffice_location_id" FROM "WORKS_FOR" WHERE "employee_id" = $1`,
      [ctx.session?.user?.employee_id]
    );

    const lowStockProducts = await postgresQuery(
      `SELECT 
      L.alert_id, 
      L.product_inventory_id, 
      L.postoffice_location_id, 
      L.alert_date, 
      L.is_resolved,
      P.product_name,
      P.product_id
      FROM 
          "LOW_STOCK_ALERTS" AS L
      JOIN 
          "PRODUCT_INVENTORY" AS PI ON L.product_inventory_id = PI.product_inventory_id
      JOIN 
          "PRODUCT" AS P ON PI.product_id = P.product_id
      WHERE
          L.postoffice_location_id = $1 AND L.is_resolved = false
      ORDER BY
      L.alert_date DESC;`,
      [managerLocation.rows[0].postoffice_location_id]
    );

    return {
      status: "success",
      products: lowStockProducts.rows as lostStockNotification[],
    };
  }),

  getCustomnerInfo: protectedProcedure.query(async ({ input, ctx }) => {
    const customerInfo = await postgresQuery(
      `SELECT
        "customer_id",
        "firstname",
        "lastname",
        "email",
        "phoneNumber",
        "address_street",
        "address_city",
        "address_state",
        "address_zipcode"

      FROM
        "CUSTOMER"
      WHERE
        "user_id" = $1`,
      [ctx.session?.user?.id]
    );

    if (customerInfo.rows.length === 0) {
      return {
        status: "success",
        customer: null,
        message: "Customer not found",
      };
    }

    return {
      status: "success",
      customer: customerInfo.rows[0] as customerInfo,
    };
  }),

  updateCustomerInfo: protectedProcedure
    .input(
      z.object({
        firstname: z.string().optional(),
        lastname: z.string().optional(),
        email: z.string().optional(),
        phonenumber: z.string().optional(),
        address_street: z.string().optional(),
        address_city: z.string().optional(),
        address_state: z.string().optional(),
        address_zipcode: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const {
        firstname,
        lastname,
        email,
        phonenumber,
        address_street,
        address_city,
        address_state,
        address_zipcode,
      } = input;

      const customerInfo = await postgresQuery(
        `SELECT
          "customer_id"
        FROM
          "CUSTOMER"
        WHERE
          "user_id" = $1`,
        [ctx.session?.user?.id]
      );

      if (customerInfo.rows.length === 0) {
        await postgresQuery(
          `INSERT INTO "CUSTOMER" ("customer_id", "firstname", "lastname", "email", "phoneNumber", "address_street", "address_city", "address_state", "address_zipcode", "updatedBy", "createdBy") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
          [
            randomUUID(),
            firstname,
            lastname,
            email,
            phonenumber,
            address_street,
            address_city,
            address_state,
            address_zipcode,
            ctx.session?.user?.id,
            ctx.session?.user?.id,
          ]
        );
      } else {
        const updateCustomerInfo = await postgresQuery(
          `UPDATE "CUSTOMER" SET "firstname" = $1, "lastname" = $2, "email" = $3, "phoneNumber" = $4, "address_street" = $5, "address_city" = $6, "address_state" = $7, "address_zipcode" = $8 WHERE "customer_id" = $9`,
          [
            firstname,
            lastname,
            email,
            phonenumber,
            address_street,
            address_city,
            address_state,
            address_zipcode,
            customerInfo.rows[0].customer_id,
          ]
        );
      }

      return {
        status: "success",
        message: "Customer info updated successfully",
      };
    }),
});

export interface getProductWithQuantity {
  product_id: string;
  product_name: string;
  product_description: string;
  price: number;
  product_image: string;
  available_quantity: number;
}

export interface lostStockNotification {
  alert_id: string;
  product_inventory_id: string;
  postoffice_location_id: string;
  alert_date: string;
  is_resolved: boolean;
  product_name: string;
  product_id: string;
}

export interface customerInfo {
  customer_id: string;
  firstname: string;
  lastname: string;
  email: string;
  phonenumber: string;
  address_street: string;
  address_city: string;
  address_state: string;
  address_zipcode: string;
}

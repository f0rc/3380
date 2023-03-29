import { randomUUID } from "crypto";
import { z } from "zod";
import { protectedProcedure, router } from "../../utils/trpc";

export const employeeSchema = z.object({
  email: z.string().email().min(1).max(50),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  birthDate: z.string().min(1).max(50),
  role: z.number().min(1).max(4),

  salary: z.number().min(1),
  locationID: z.string().min(1).max(50),

  address_street: z.string().min(1).max(50),
  address_city: z.string().min(1).max(50),
  address_state: z.string().min(1).max(50),
  address_zipcode: z.string().min(1).max(50),

  startDate: z.string().min(1).max(50),
});

export type employeeSchemaType = z.infer<typeof employeeSchema>;

export const employeeRouter = router({
  createEmployee: protectedProcedure
    .input(employeeSchema)
    .mutation(async ({ ctx, input }) => {
      const { postgresQuery } = ctx;

      const dbCreateEmployee = await postgresQuery(
        `INSERT INTO "EMPLOYEE" ("employee_id", "email","firstname", "lastname", "birthdate", "role", "salary", "postoffice_location_id", "address_street", "address_city", "address_state", "address_zipcode", "startdate" , "createdBy", "updatedBy") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING "employee_id" as empID`,
        [
          randomUUID(), //##TODO: make this a uuid in the db automatically
          input.email,
          input.firstName,
          input.lastName,
          input.birthDate,
          input.role,
          input.salary,
          input.locationID,

          input.address_street,
          input.address_city,
          input.address_state,
          input.address_zipcode,
          input.startDate,
          ctx.session.user.id, // employeeID
          ctx.session.user.id, // employeeID
        ]
      );
      console.log(dbCreateEmployee.rows[0].empID);
      return dbCreateEmployee.rows[0].empID;
    }),
});

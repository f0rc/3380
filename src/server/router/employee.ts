import { randomUUID } from "crypto";
import { employeeSchema } from "src/frontend/pages/CreateEmployee";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../utils/trpc";

export const employeeRouter = router({
  createEmployee: protectedProcedure
    .input(employeeSchema)
    .mutation(async ({ ctx, input }) => {
      const { postgresQuery } = ctx;

      const dbCreateEmployee = await postgresQuery(
        `INSERT INTO "Employees" ("id", "firstName", "lastName", "birthDate", "email", "role", "salary", "locationID", "address_street","address_city", "address_state", "address_zipcode", "createdBy", "updatedBy") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING "employeeID" as employeeID`,
        [
          randomUUID(), //##TODO: make this a uuid in the db automatically
          input.firstName,
          input.lastName,
          input.birthDate,
          input.email,
          input.role,
          input.salary,

          input.address_street,
          input.address_city,
          input.address_state,
          input.address_zipcode,
          ctx.session.user.id, // employeeID
          ctx.session.user.id, // employeeID
        ]
      );
      console.log(dbCreateEmployee.rows[0].employeeid);
      return dbCreateEmployee.rows[0].employeeid;
    }),
});

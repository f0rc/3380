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

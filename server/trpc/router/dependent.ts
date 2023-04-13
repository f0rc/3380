import { randomUUID } from "crypto";
import { z } from "zod";
import { protectedProcedure, router } from "../../utils/trpc";

export const dependentSchema = z.object({
  dependent_name: z.string().min(1).max(50),
  dependent_birthDate: z.string().min(1).max(50),
  employee_id: z.string(),
  relationship: z.string().min(1).max(50),
});

export const dependentUpdateSchema = z.object({
    dependent_name: z.string().min(1).max(50),
    dependent_birthDate: z.string(),
    employee_id: z.string(),
    relationship: z.string(),
});

export type dependentUpdateSchema = z.infer<typeof dependentUpdateSchema>;

export type dependentSchemaType = z.infer<typeof dependentSchema>;

export const dependentRouter = router({
  createDependent: protectedProcedure
    .input(dependentSchema)
    .mutation(async ({ ctx, input }) => {
      const { postgresQuery } = ctx;

      //TODO ADD A WORKS FOR INSERT INTO DB FOR THE LOCATION input.locationID
      const dbCreateDependent = await postgresQuery(
        `INSERT INTO "DEPENDENT" ("dependent_id", "dependent_name", "dependent_birthDate", "employee_id", "relationship", "createdBy", "updatedBy") VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING "dependent_id" as depID`,
        [
          randomUUID(), //##TODO: make this a uuid in the db automatically $1
          input.dependent_name, // $2
          input.dependent_birthDate, // $3
          ctx.session.user.employee_id, // $4
          input.relationship, // $5
          ctx.session.user.id, // employeeID $6
          ctx.session.user.id, // employeeID $7
        ]
      );
      return dbCreateDependent.rows[0].depID;
    }),

  getAllDependent: protectedProcedure.query(async ({ ctx, input }) => {
    const { postgresQuery } = ctx;

    const dbGetDependent = await postgresQuery(
      // get all the employees that have a lower role than the current user
      `SELECT
        D.dependent_id,
        D.dependent_name,
        D.dependent_birthDate,
        D.employee_id,
        D.relationship
      FROM
          "DEPENDENT" AS D
          LEFT JOIN "EMPLOYEE" AS E ON D.employee_id = E.employee_id
      ORDER BY
          D.employee_id;`,
      []
    );

    console.log(dbGetDependent.rows);

    return {
      status: "success",
      dependents: dbGetDependent.rows as dependentList[],
    };
  }),
  getDependent: protectedProcedure
    .input(z.object({ dependentID: z.string() }))
    .query(async ({ ctx, input }) => {
      const { postgresQuery } = ctx;

      const dbGetDependent = await postgresQuery(
        `SELECT
        D.*,
        E.firstname AS employee_lastname,
        E.lastname AS employee_lastname,
        E.employee_id AS employee_id,
      FROM
          "DEPENDENT" AS D
          LEFT JOIN "EMPLOYEE" AS E ON D.employee_id = E.employee_id
      WHERE
          D.dependent_id = $1
      ORDER BY
          D.dependent_id;`,
        [input.dependentID]
      );

      console.log(dbGetDependent.rows);

      return {
        status: "success",
        dependent: dbGetDependent.rows[0] as dependentDetail,
      };
    }),

  updateDependent: protectedProcedure
    .input(dependentUpdateSchema.partial())
    .mutation(async ({ ctx, input }) => {
      const { postgresQuery } = ctx;
      // TODO: add a check to make sure the user is allowed to update the employee
      // TODO: bug where updating the employee when they are a manager to demote them to an employee will not update the manager_id of the employees they manage ?? maybe a trigger in the db?

      const dbUpdateDependent = await postgresQuery(
        `UPDATE "DEPENDENT" SET 
        "dependent_name" = $1, 
        "dependent_birthDate" = $2, 
        "employee_id" = $3, 
        "relationship" = $4,
        "updatedBy" = $5`,
        [
            input.dependent_name, // $1
            input.dependent_birthDate, // $2
            ctx.session.user.employee_id, // $3
            input.relationship, // $4
            ctx.session.user.id, // sessionID $5
        ]
      );

      if (dbUpdateDependent.rows.length === 0)
        return {
          status: "fail",
          message: "No dependent found",
        };

      return {
        status: "success",
        message: "Dependent updated",
      };
    }),

});


export interface dependentInfo {
    dependent_name: string;
    employee_id: string;
  }

export interface dependentList {
  dependent_id: string;
  dependent_name: string;
  dependent_birthDate: string;
  employee_id: string;
  relationship: string;
}
export interface dependentDetail {
  dependent_id: string;
  dependent_name: string;
  dependent_birthDate: string;
  employee_id: string | undefined;
  relationship: string;
  createdBy: string;

}

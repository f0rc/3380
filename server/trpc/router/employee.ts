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

  address_street: z.string().min(1).max(50),
  address_city: z.string().min(1).max(50),
  address_state: z.string().min(1).max(50),
  address_zipcode: z.string().min(1).max(50),

  startDate: z.string().min(1).max(50),
});

export const employeeUpdateSchema = z.object({
  email: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  address_street: z.string(),
  address_city: z.string(),
  address_state: z.string(),
  address_zipcode: z.number(),
  role: z.number(),
  salary: z.number(),
  manager_id: z.string(),
  postoffice_location_id: z.string(),
});

export type employeeUpdateSchema = z.infer<typeof employeeUpdateSchema>;

export type employeeSchemaType = z.infer<typeof employeeSchema>;

export const employeeRouter = router({
  createEmployee: protectedProcedure
    .input(employeeSchema)
    .mutation(async ({ ctx, input }) => {
      const { postgresQuery } = ctx;

      //TODO ADD A WORKS FOR INSERT INTO DB FOR THE LOCATION input.locationID
      const dbCreateEmployee = await postgresQuery(
        `INSERT INTO "EMPLOYEE" ("employee_id", "email","firstname", "lastname", "birthdate", "role", "salary", "manager_id", "address_street", "address_city", "address_state", "address_zipcode", "startdate" , "createdBy", "updatedBy") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING "employee_id" as empID`,
        [
          randomUUID(), //##TODO: make this a uuid in the db automatically
          input.email,
          input.firstName,
          input.lastName,
          input.birthDate,
          input.role,
          input.salary,
          ctx.session.user.employee_id,
          // input.locationID,

          input.address_street,
          input.address_city,
          input.address_state,
          input.address_zipcode,
          input.startDate,
          ctx.session.user.id, // employeeID
          ctx.session.user.id, // employeeID
        ]
      );

      const dbCreateWorksFor = await postgresQuery(
        `INSERT INTO "WORKS_FOR" ("employee_id", "postoffice_location_id") VALUES ($1, $2)`,
        [dbCreateEmployee.rows[0].empid, 9]
      );
      return dbCreateEmployee.rows[0].empID;
    }),

  getAllEmployee: protectedProcedure.query(async ({ ctx, input }) => {
    const { postgresQuery } = ctx;

    const dbGetEmployee = await postgresQuery(
      // get all the employees that have a lower role than the current user
      `SELECT
        E.employee_id,
        E.firstname,
        E.lastname,
        E.role,
        E.salary,
        E.manager_id,
        M.lastname AS manager_lastname,
        PL.locationname,
        PL.address_street,
        PL.address_city,
        PL.address_state,
        PL.address_zipcode,
        WF.hours
      FROM
          "EMPLOYEE" AS E
          LEFT JOIN "WORKS_FOR" AS WF ON E.employee_id = WF.employee_id
          LEFT JOIN "POSTOFFICE_LOCATION" AS PL ON WF.postoffice_location_id = PL.postoffice_location_id
          LEFT JOIN "EMPLOYEE" AS M ON E.manager_id = M.employee_id
      ORDER BY
          E.employee_id;`,
      []
    );

    // console.log(dbGetEmployee.rows);

    return {
      status: "success",
      employees: dbGetEmployee.rows as employeeList[],
    };
  }),
  getEmployee: protectedProcedure
    .input(z.object({ employeeID: z.string() }))
    .query(async ({ ctx, input }) => {
      const { postgresQuery } = ctx;

      const dbGetEmployee = await postgresQuery(
        `SELECT
        E.*,
        M.lastname AS manager_lastname,
        PL.postoffice_location_id,
        PL.locationname AS postoffice_locationname,
        PL.address_street AS postoffice_address_street,
        PL.address_city AS postoffice_address_city,
        PL.address_state AS postoffice_address_state,
        PL.address_zipcode AS postoffice_address_zipcode,
        WF.hours
      FROM
          "EMPLOYEE" AS E
          LEFT JOIN "WORKS_FOR" AS WF ON E.employee_id = WF.employee_id
          LEFT JOIN "POSTOFFICE_LOCATION" AS PL ON WF.postoffice_location_id = PL.postoffice_location_id
          LEFT JOIN "EMPLOYEE" AS M ON E.manager_id = M.employee_id
      WHERE
          E.employee_id = $1
      ORDER BY
          E.employee_id;`,
        [input.employeeID]
      );

      // console.log(dbGetEmployee.rows);

      return {
        status: "success",
        employee: dbGetEmployee.rows[0] as employeeDetail,
      };
    }),

  getAllManagers: protectedProcedure.query(async ({ ctx }) => {
    const { postgresQuery } = ctx;

    const dbGetAllManagers = await postgresQuery(
      // get all the employees that have a lower role than the current user
      `SELECT E.employee_id as manager_id, E.firstname as manager_firstname, E.lastname as manager_lastname FROM "EMPLOYEE" AS E WHERE E.role = 3;`,
      []
    );

    if (dbGetAllManagers.rows.length === 0)
      return {
        status: "fail",
        message: "No managers found",
      };

    return {
      status: "success",
      employees: dbGetAllManagers.rows as manager[],
    };
  }),

  updateEmployee: protectedProcedure
    .input(employeeUpdateSchema.partial())
    .mutation(async ({ ctx, input }) => {
      const { postgresQuery } = ctx;
      // TODO: add a check to make sure the user is allowed to update the employee
      // TODO: bug where updating the employee when they are a manager to demote them to an employee will not update the manager_id of the employees they manage ?? maybe a trigger in the db?

      const dbUpdateEmployee = await postgresQuery(
        `UPDATE "EMPLOYEE" SET 
        "firstname" = $1, 
        "lastname" = $2, 
        "role" = $3, 
        "salary" = $4, 
        "manager_id" = $5, 
        "address_street" = $6, 
        "address_city" = $7, 
        "address_state" = $8, 
        "address_zipcode" = $9, 
        "updatedBy" = $10 
        WHERE "email" = $11 RETURNING employee_id;`,
        [
          input.firstname, //1
          input.lastname, //2
          input.role, //3
          input.salary, //4
          input.manager_id, //5
          input.address_street, //6
          input.address_city, //7
          input.address_state, //8
          input.address_zipcode, //9
          ctx.session.user.employee_id, // employeeID //10
          input.email, //11
        ]
      );

      const dbUpdateWorksFor = await postgresQuery(
        `UPDATE "WORKS_FOR" SET
        "postoffice_location_id" = $1
        WHERE "employee_id" = $2;`,
        [input.postoffice_location_id, dbUpdateEmployee.rows[0].employee_id]
      );

      if (dbUpdateEmployee.rows.length === 0)
        return {
          status: "fail",
          message: "No employee found",
        };

      return {
        status: "success",
        message: "Employee updated",
      };
    }),
  getemployeeNameHours: protectedProcedure.query(async ({ ctx }) => {
    const { postgresQuery } = ctx;

    const dbGetWeekHours = await postgresQuery(
      // get all the employees info and their hours worked summed per week
      `SELECT
          employee_id,
          date_trunc('week', date) AS week_start_date,
          SUM(hours) AS total_hours
          FROM
              "WORK_LOG"
          WHERE
              employee_id = $1
          GROUP BY
              employee_id,
              date_trunc('week', date)`,
      [ctx.session.user.employee_id]
    );
    if (dbGetWeekHours.rows.length === 0)
      return {
        status: "fail",
        message: "No hours found",
      };

    const employee = await postgresQuery(
      `SELECT
          E.firstname,
          E.lastname
          FROM "EMPLOYEE" AS E WHERE E.employee_id = $1`,
      [ctx.session.user.employee_id]
    );
    if (employee.rows.length === 0) {
      return {
        status: "fail",
        message: "No employee found",
      };
    }

    return {
      status: "success",
      weekLog: dbGetWeekHours.rows as weekLog[],
      employeeInfo: employee.rows[0] as employeeInfo,
    };
  }),
  // work log get all group hours per week
  workLogAdd: protectedProcedure
    .input(z.object({ employeeID: z.string(), hours: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { postgresQuery } = ctx;

      const dbGetWorkLog = await postgresQuery(
        `INSERT INTO "WORK_LOG" (employee_id, hours) VALUES ($1, $2) RETURNING "WORK_LOG".work_log_id;`, // daily hours logged
        [input.employeeID, input.hours]
      );

      return {
        status: "success",
        workLog: dbGetWorkLog.rows,
      };
    }),
});

export interface weekLog {
  employee_id: string;
  week_start_date: string;
  total_hours: number;
}
export interface employeeInfo {
  firstname: string;
  lastname: string;
}

export interface manager {
  manager_id: string;
  manager_firstname: string;
  manager_lastname: string;
}

export interface employeeList {
  employee_id: string;
  firstname: string;
  lastname: string;
  role: number;
  hours: number;
  salary: number;
  manager_id: string;
  manager_lastname: string;
  locationname: string;
  address_street: string;
  address_city: string;
  address_state: string;
  address_zipcode: number;
}
export interface employeeDetail {
  employee_id: string;
  user_id: string | null;
  email: string;
  firstname: string;
  lastname: string;
  birthdate: string;
  role: number;
  salary: number;
  manager_id: string | null;
  manager_lastname: string | null;
  address_street: string;
  address_city: string;
  address_state: string;
  address_zipcode: number;
  startdate: string;
  createdBy: string;
  postoffice_location_id: string;
  postoffice_locationname: string;
  postoffice_address_street: string;
  postoffice_address_city: string;
  postoffice_address_state: string;
  postoffice_address_zipcode: number;
  hours: number;
}

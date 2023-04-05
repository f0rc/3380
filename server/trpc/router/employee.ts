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

export type employeeSchemaType = z.infer<typeof employeeSchema>;

export const employeeRouter = router({
  createEmployee: protectedProcedure
    .input(employeeSchema)
    .mutation(async ({ ctx, input }) => {
      const { postgresQuery } = ctx;

      //TODO ADD A WORKS FOR INSERT INTO DB FOR THE LOCATION input.locationID
      const dbCreateEmployee = await postgresQuery(
        `INSERT INTO "EMPLOYEE" ("employee_id", "email","firstname", "lastname", "birthdate", "role", "salary", "manager_id" "address_street", "address_city", "address_state", "address_zipcode", "startdate" , "createdBy", "updatedBy") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING "employee_id" as empID`,
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
          JOIN "WORKS_FOR" AS WF ON E.employee_id = WF.employee_id
          JOIN "POSTOFFICE_LOCATION" AS PL ON WF.postoffice_location_id = PL.postoffice_location_id
          LEFT JOIN "EMPLOYEE" AS M ON E.manager_id = M.employee_id
      WHERE
          E.role < $1
      ORDER BY
          E.employee_id;`,
      [ctx.session.user.role]
    );

    console.log(dbGetEmployee.rows);

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
        PL.locationname AS postoffice_locationname,
        PL.address_street AS postoffice_address_street,
        PL.address_city AS postoffice_address_city,
        PL.address_state AS postoffice_address_state,
        PL.address_zipcode AS postoffice_address_zipcode,
        WF.hours
      FROM
          "EMPLOYEE" AS E
          JOIN "WORKS_FOR" AS WF ON E.employee_id = WF.employee_id
          JOIN "POSTOFFICE_LOCATION" AS PL ON WF.postoffice_location_id = PL.postoffice_location_id
          LEFT JOIN "EMPLOYEE" AS M ON E.manager_id = M.employee_id
      WHERE
          E.employee_id = $1
      ORDER BY
          E.employee_id;`,
        [input.employeeID]
      );

      console.log(dbGetEmployee.rows);

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
});

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

// list employee detail example
// {
//   employee_id: "c0cb263c-8e18-4ba5-85ce-70b5451b9f37",
//   user_id: null,
//   email: "fuck@fuck.com",
//   firstname: "fuck",
//   lastname: "fuck",
//   birthdate: new Date("1121-01-01T05:50:36.000Z"),
//   role: 1,
//   salary: 10200,
//   manager_id: null,
//   manager_lastname: null,

//   address_street: "kaljsdf",
//   address_city: "laksjfd",
//   address_state: "alskjfd",
//   address_zipcode: 1283,

//   startdate: new Date("2023-01-26T06:00:00.000Z"),
//   createAt: new Date("2023-04-03T06:23:22.681Z"),
//   createdBy: "0eeba770-7b60-4e87-95f3-869729b1b373",
//   updatedAt: new Date("2023-04-03T06:23:22.681Z"),
//   updatedBy: "0eeba770-7b60-4e87-95f3-869729b1b373",

//   postoffice_locationname: "money muel",
//   postoffice_address_street: "123 jane st",
//   postoffice_address_city: "fuck",
//   postoffice_address_state: "you",
//   postoffice_address_zipcode: 1234,
//   hours: 0,
// };

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
  postoffice_locationname: string;
  postoffice_address_street: string;
  postoffice_address_city: string;
  postoffice_address_state: string;
  postoffice_address_zipcode: number;
  hours: number;
}

// employee list
// {
//   employee_id: 'c0cb263c-8e18-4ba5-85ce-70b5451b9f37',
//   firstname: 'fuck',
//   lastname: 'fuck',
//   role: 1,
//   manager_id: null,
//   manager_lastname: null,
//   locationname: 'money muel',
//   address_street: '123 jane st',
//   address_city: 'fuck',
//   address_state: 'you',
//   address_zipcode: 1234
// }

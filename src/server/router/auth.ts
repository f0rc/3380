import { hash, verify } from "argon2";
import { randomUUID } from "crypto";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, publicProcedure, router } from "../utils/trpc";
import { loginSchema, signUpSchema } from "../auth/authSchema";
import { AuthUser } from "src/utils/auth";
import Cookies from "cookies";

export const credRouter = router({
  signUp: publicProcedure
    .input(signUpSchema)
    .mutation(async ({ ctx, input }) => {
      const { postgresQuery } = ctx;
      const { email, password, username } = input;

      const existingUser = await postgresQuery(
        `SELECT * from "USER" where "email"= $1 LIMIT 1`,
        [email]
      );

      if (existingUser.rowCount > 0) {
        //todo: throw error
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email already in use",
        });
      }

      const hashedPassword = await hash(password);
      const id = randomUUID();
      console.log(id);
      const result = await postgresQuery(
        `INSERT INTO "USER" (user_id, email, password) values ($1, $2, $3) returning *`,
        [id, email, hashedPassword]
      );

      return {
        status: "success",
        // user: result.rows,
      };
    }),

  signin: publicProcedure
    .input(loginSchema)
    .mutation(async ({ ctx, input }) => {
      const { postgresQuery } = ctx;
      const { email, password } = input;

      // console.log("email", email);
      const data = await postgresQuery(
        `SELECT * FROM "USER" WHERE "email" = $1;`,
        [email]
      );

      const verifiedPassword = await verify(data.rows[0].password, password);

      if (!verifiedPassword) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid credentials",
        });
      }

      // console.log("data", data);

      const user = mapDBUserToUser(data.rows[0]);
      // console.log("user", user);

      const sessionToken = randomUUID();
      const sessionMaxAge = 60 * 60 * 24 * 7; // 7 days
      const sessionexpires = fromDate(sessionMaxAge);

      //creating a session
      await postgresQuery(
        `INSERT INTO "SESSION" ("session_id", "user_id", "token", "expires") VALUES ($1, $2, $3, $4);`,
        [sessionToken, user.id, sessionToken, sessionexpires]
      );
      const cookies = new Cookies(ctx.req, ctx.res);
      cookies.set("auth-session-id", sessionToken, {
        expires: sessionexpires,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });

      return {
        status: "success",
        user,
      };
    }),
  logout: protectedProcedure.mutation(async ({ ctx }) => {
    const { postgresQuery, session } = ctx;

    console.log(session.user.id);
    postgresQuery(`DELETE FROM "SESSION" where "user_id" = $1`, [
      session.user.id,
    ]);

    const cookies = new Cookies(ctx.req, ctx.res);
    cookies.set("auth-session-id", "", {
      expires: new Date(0),
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return {
      status: "success",
    };
  }),
});

export const mapDBUserToUser = (dbUser: any): AuthUser => {
  return {
    id: dbUser.user_id,
    email: dbUser.email,
    password: dbUser.password,
  };
};

const fromDate = (time: number, date = Date.now()) =>
  new Date(date + time * 1000);

import { z } from "zod";

import { router, publicProcedure } from "../trpc";

import { hash } from "argon2";
import { signUpSchema } from "../auth/authSchema";
import { randomUUID } from "crypto";
import { TRPCError } from "@trpc/server";

export const credRouter = router({
  signUp: publicProcedure
    .input(signUpSchema)
    .mutation(async ({ ctx, input }) => {
      const { postgres } = ctx;
      const { email, password, username } = input;

      const existingUser = await postgres(
        `select * from "Users" where "email"= $1 LIMIT 1`,
        [email]
      );
      console.log(existingUser);
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
      const result = await postgres(
        `insert into "Users" (id, name, email, password) values ($1, $2, $3, $4) returning *`,
        [id, username, email, hashedPassword]
      );

      return {
        status: "success",
        user: result.rows,
      };
    }),
});

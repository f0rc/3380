import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../utils/trpc";

export const greetingRouter = router({
  hello: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .query(({ input, ctx }) => {
      return {
        greeting: `hello ${input?.name ?? "world"}`,
      };
    }),

  secretMessage: protectedProcedure.query(() => {
    return "This is a secret message";
  }),
});

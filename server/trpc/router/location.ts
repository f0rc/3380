import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../../utils/trpc";

export const locationRouter = router({
  create: protectedProcedure.query(({ input, ctx }) => {
    return {
      greeting: `hello "world"}`,
    };
  }),

  secretMessage: protectedProcedure.query(() => {
    return "This is the pacer test";
  }),
});

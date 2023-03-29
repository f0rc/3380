import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../../utils/trpc";

export const greetingRouter = router({
  hello: publicProcedure.query(({ input, ctx }) => {
    return {
      greeting: `hello "world"}`,
    };
  }),

  secretMessage: protectedProcedure.query(() => {
    return "This is the pacer test";
  }),
});

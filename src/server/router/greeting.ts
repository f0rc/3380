import { z } from "zod";
import { publicProcedure, router } from "../utils/trpc";

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
});

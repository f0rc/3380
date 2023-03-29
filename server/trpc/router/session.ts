import { protectedProcedure, publicProcedure, router } from "../../utils/trpc";

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
});

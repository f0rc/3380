import superjson from "superjson";
import { initTRPC, TRPCError } from "@trpc/server";
import { type Context } from "./context";

export const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;

const enforceAuth = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
  }
  return next({
    ctx: {
      session: {
        ...ctx.session,
        user: ctx.session.user,
      },
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceAuth);

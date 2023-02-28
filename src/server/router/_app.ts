import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { greetingRouter } from "./greeting";

export const appRouter = router({
  greeting: greetingRouter,
});

export type AppRouter = typeof appRouter;

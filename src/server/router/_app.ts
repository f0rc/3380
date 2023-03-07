import { router } from "../utils/trpc";
import { authRouter } from "./session";
import { greetingRouter } from "./greeting";
import { credRouter } from "./auth";

// Add your routers here
export const appRouter = router({
  session: authRouter,
  auth: credRouter,
  greeting: greetingRouter,
});

export type AppRouter = typeof appRouter;
